from config import supabase
from datetime import datetime

class EventRequest:
    @staticmethod
    def create_event_request(department_id, event_name, description, location, date, start_time, end_time, participant_limit):
        """Create a new event request"""
        return supabase.table("event_requests").insert({
            "department_id": department_id,
            "event_name": event_name,
            "description": description,
            "location": location,
            "date": date,
            "start_time": start_time,
            "end_time": end_time,
            "participant_limit": participant_limit,
            "status": "Pending"
        }).execute()

    @staticmethod
    def get_requests_by_department(department_id):
        """Get all event requests for a specific department"""
        return supabase.table("event_requests").select("*").eq("department_id", department_id).order("created_at", desc=True).execute()

    @staticmethod
    def get_request_by_id(request_id):
        """Get a specific event request by ID"""
        return supabase.table("event_requests").select("*").eq("id", request_id).execute()

    @staticmethod
    def update_request_status(request_id, status):
        """Update the status of an event request"""
        return supabase.table("event_requests").update({"status": status}).eq("id", request_id).execute()

    @staticmethod
    def delete_request(request_id):
        """Delete an event request"""
        return supabase.table("event_requests").delete().eq("id", request_id).execute()