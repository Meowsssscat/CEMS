from config import supabase
from datetime import datetime, time

class EventRequestManagement:
    @staticmethod
    def get_all_pending_requests():
        """Get all pending event requests with department information"""
        requests = supabase.table("event_requests").select(
            "*, users!event_requests_department_id_fkey(full_name, department_name, email)"
        ).eq("status", "Pending").order("created_at", desc=True).execute()
        return requests

    @staticmethod
    def get_all_requests():
        """Get all event requests with department information"""
        requests = supabase.table("event_requests").select(
            "*, users!event_requests_department_id_fkey(full_name, department_name, email)"
        ).eq("status", "Pending").order("created_at", desc=True).execute()
        return requests

    @staticmethod
    def get_request_by_id(request_id):
        """Get specific event request details"""
        return supabase.table("event_requests").select(
            "*, users!event_requests_department_id_fkey(full_name, department_name, email)"
        ).eq("id", request_id).execute()

    @staticmethod
    def check_schedule_conflict(location, date, start_time, end_time, exclude_request_id=None):
        """
        Check if there's a schedule conflict for the given location, date, and time
        Returns True if conflict exists, False otherwise
        """
        try:
            # Get all approved events for the same date and location
            query = supabase.table("events").select("*").eq("location", location).eq("date", date)
            
            existing_events = query.execute()
            
            if not existing_events.data:
                return False
            
            # Convert start_time and end_time to time objects for comparison
            if isinstance(start_time, str):
                new_start = datetime.strptime(start_time, "%H:%M:%S").time()
            else:
                new_start = start_time
                
            if isinstance(end_time, str):
                new_end = datetime.strptime(end_time, "%H:%M:%S").time()
            else:
                new_end = end_time
            
            # Check for time overlap with existing events
            for event in existing_events.data:
                # Skip if this is the same request being updated
                if exclude_request_id and event.get("event_request_id") == exclude_request_id:
                    continue
                
                # Convert existing event times
                if isinstance(event["start_time"], str):
                    existing_start = datetime.strptime(event["start_time"], "%H:%M:%S").time()
                else:
                    existing_start = event["start_time"]
                    
                if isinstance(event["end_time"], str):
                    existing_end = datetime.strptime(event["end_time"], "%H:%M:%S").time()
                else:
                    existing_end = event["end_time"]
                
                # Check for overlap: (StartA < EndB) and (EndA > StartB)
                if (new_start < existing_end) and (new_end > existing_start):
                    return True
            
            return False
            
        except Exception as e:
            print(f"Error checking schedule conflict: {e}")
            return True  # Assume conflict on error for safety

    @staticmethod
    def approve_request(request_id):
        """
        Approve an event request and create the corresponding event
        Returns (success: bool, message: str)
        """
        try:
            # Get request details
            request_response = EventRequestManagement.get_request_by_id(request_id)
            
            if not request_response.data:
                return False, "Request not found"
            
            request_data = request_response.data[0]
            
            # Check if already processed
            if request_data["status"] != "Pending":
                return False, f"Request already {request_data['status'].lower()}"
            
            # Check for schedule conflict
            has_conflict = EventRequestManagement.check_schedule_conflict(
                location=request_data["location"],
                date=request_data["date"],
                start_time=request_data["start_time"],
                end_time=request_data["end_time"],
                exclude_request_id=request_id
            )
            
            if has_conflict:
                # Auto-reject due to conflict
                supabase.table("event_requests").update({
                    "status": "Rejected"
                }).eq("id", request_id).execute()
                return False, "Schedule conflict detected. Request automatically rejected."
            
            # No conflict - approve and create event
            # Update request status
            supabase.table("event_requests").update({
                "status": "Approved"
            }).eq("id", request_id).execute()
            
            # Create event
            supabase.table("events").insert({
                "event_request_id": request_id,
                "event_name": request_data["event_name"],
                "description": request_data["description"],
                "location": request_data["location"],
                "date": request_data["date"],
                "start_time": request_data["start_time"],
                "end_time": request_data["end_time"],
                "participant_limit": request_data["participant_limit"],
                "department_id": request_data["department_id"],
                "status": "Active"
            }).execute()
            
            return True, "Event request approved successfully!"
            
        except Exception as e:
            print(f"Error approving request: {e}")
            return False, f"Error approving request: {str(e)}"

    @staticmethod
    def reject_request(request_id):
        """
        Reject an event request
        Returns (success: bool, message: str)
        """
        try:
            # Get request details
            request_response = EventRequestManagement.get_request_by_id(request_id)
            
            if not request_response.data:
                return False, "Request not found"
            
            request_data = request_response.data[0]
            
            # Check if already processed
            if request_data["status"] != "Pending":
                return False, f"Request already {request_data['status'].lower()}"
            
            # Update request status to rejected
            supabase.table("event_requests").update({
                "status": "Rejected"
            }).eq("id", request_id).execute()
            
            return True, "Event request rejected."
            
        except Exception as e:
            print(f"Error rejecting request: {e}")
            return False, f"Error rejecting request: {str(e)}"

    @staticmethod
    def get_request_counts_by_status():
        """Get count of all requests grouped by status"""
        all_requests = supabase.table("event_requests").select("status").execute()
        
        counts = {"Pending": 0, "Approved": 0, "Rejected": 0, "Cancelled": 0}
        if all_requests.data:
            for req in all_requests.data:
                status = req.get("status", "Pending")
                counts[status] = counts.get(status, 0) + 1
        
        return counts