from config import supabase

class User:
    @staticmethod
    def create_user(full_name, student_id, email, password, role="student"):
        return supabase.table("users").insert({
            "full_name": full_name,
            "student_id": student_id,
            "email": email,
            "password": password,
            "role": role
        }).execute()

    @staticmethod
    def get_user_by_email(email):
        return supabase.table("users").select("*").eq("email", email).execute()
