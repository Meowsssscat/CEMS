from flask import render_template, request, redirect, url_for, flash, session
from models.user import User
from config import supabase


def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        try:
            
            auth_response = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })

            if auth_response.user and auth_response.user.email_confirmed_at:
                

                user = User.get_user_by_email(email)
                if user.data:
                    u = user.data[0]
                    
                    # Store user information in session
                    session["user_email"] = email
                    session["user_name"] = u.get("full_name", "User")
                    session["user_role"] = u.get("role", "student")
                    session["department_name"] = u.get("department_name", "Department")
                    
                    flash("Login successful!", "success")

                    if u["role"] == "osas":
                        return redirect(url_for("osas_dashboard"))
                    elif u["role"] == "department":
                        return redirect(url_for("department_dashboard"))
                    else:
                        return redirect(url_for("student_dashboard"))
            else:
                flash("Please verify your email first.", "warning")

        except Exception as e:
            flash(f"Login failed: {e}", "danger")

    return render_template("login.html")


def signup():
    if request.method == "POST":
        # full_name = request.form["full_name"]
        # student_id = request.form["student_id"]
        # email = request.form["email"]
        # password = request.form["password"]

        # try:
        #     # ✅ Check if email already exists in users table
        #     existing_email = User.get_user_by_email(email)
        #     if existing_email.data:
        #         flash("Email already registered. Please log in instead.", "danger")
        #         return redirect(url_for("user.signup"))

        #     # ✅ Check if student ID already exists
        #     existing_id = supabase.table("users").select("*").eq("student_id", student_id).execute()
        #     if existing_id.data:
        #         flash("Student ID already registered.", "danger")
        #         return redirect(url_for("user.signup"))

        #     # ✅ Register user in Supabase Auth (sends verification email)
        #     auth_response = supabase.auth.sign_up({
        #         "email": email,
        #         "password": password,
        #     })

        #     if auth_response.user:
        #         # ✅ Store in users table (no need for password here)
        #         User.create_user(
        #             full_name=full_name,
        #             student_id=student_id,
        #             email=email,
        #             password=password,
        #             role="student"
        #         )
        #         flash("Signup successful! Please verify your email before logging in.", "success")
        #         return redirect(url_for("user.login"))
        #     else:
        #         flash("Error creating account. Try again later.", "danger")

        # except Exception as e:
        #     flash(f"Signup failed: {e}", "danger")
        flash(">>>>>>>>>> BAYAD MUNA :) <<<<<<<<<<" )

    return render_template("signup.html")


def logout():
    """Handle user logout"""
    try:
        # Sign out from Supabase
        supabase.auth.sign_out()
        
        # Clear session
        session.clear()
        
        flash("Logged out successfully.", "success")
    except Exception as e:
        flash(f"Logout error: {e}", "danger")
    
    return redirect(url_for("user.login"))