from config import supabase

class RequestStatus:
    @staticmethod
    def get_all_requests_by_department(department_id):
        """Get all event requests for a specific department with ordering"""
        return supabase.table("event_requests").select("*").eq("department_id", department_id).order("created_at", desc=True).execute()

    @staticmethod
    def get_request_details(request_id):
        """Get detailed information about a specific request"""
        return supabase.table("event_requests").select("*").eq("id", request_id).execute()

    @staticmethod
    def delete_request_by_id(request_id, department_id):
        """Delete a request (only if it belongs to the department and is pending)"""
        # First verify the request belongs to this department
        request = supabase.table("event_requests").select("*").eq("id", request_id).eq("department_id", department_id).execute()
        
        if request.data and request.data[0]["status"] == "Pending":
            return supabase.table("event_requests").delete().eq("id", request_id).execute()
        return None

    @staticmethod
    def get_requests_by_status(department_id, status):
        """Get requests filtered by status"""
        return supabase.table("event_requests").select("*").eq("department_id", department_id).eq("status", status).order("created_at", desc=True).execute()

    @staticmethod
    def count_requests_by_status(department_id):
        """Get count of requests grouped by status"""
        all_requests = supabase.table("event_requests").select("status").eq("department_id", department_id).execute()
        
        counts = {"Pending": 0, "Approved": 0, "Rejected": 0, "Cancelled": 0}
        if all_requests.data:
            for req in all_requests.data:
                status = req.get("status", "Pending")
                counts[status] = counts.get(status, 0) + 1
        
        return counts

    @staticmethod
    def update_request(request_id, department_id, event_name, description, location, date, start_time, end_time, participant_limit):
        """Update an event request (only if pending and belongs to department)"""
        # First verify the request belongs to this department and is pending
        request = supabase.table("event_requests").select("*").eq("id", request_id).eq("department_id", department_id).execute()
        
        if request.data and request.data[0]["status"] == "Pending":
            return supabase.table("event_requests").update({
                "event_name": event_name,
                "description": description,
                "location": location,
                "date": date,
                "start_time": start_time,
                "end_time": end_time,
                "participant_limit": participant_limit
            }).eq("id", request_id).execute()
        return None

    @staticmethod
    def cancel_request(request_id, department_id):
        """Cancel a request by changing its status to 'Cancelled'"""
        # First verify the request belongs to this department and is pending
        request = supabase.table("event_requests").select("*").eq("id", request_id).eq("department_id", department_id).execute()
        
        if request.data and request.data[0]["status"] == "Pending":
            return supabase.table("event_requests").update({
                "status": "Cancelled"
            }).eq("id", request_id).execute()
        return None