from flask import render_template, request, redirect, url_for, flash, session
from models.event_request_management import EventRequestManagement
from models.user import User

def view_event_requests():
    """Display all pending event requests for OSAS approval"""
    # Check if user is logged in and is OSAS
    if "user_email" not in session:
        flash("Please login first.", "warning")
        return redirect(url_for("user.login"))
    
    # Get user details
    user_response = User.get_user_by_email(session["user_email"])
    if not user_response.data:
        flash("User not found.", "danger")
        return redirect(url_for("user.login"))
    
    user = user_response.data[0]
    
    if user["role"] != "osas":
        flash("Access denied. OSAS accounts only.", "danger")
        return redirect(url_for("home"))
    
    try:
        # Get all pending requests
        requests_response = EventRequestManagement.get_all_pending_requests()
        requests = requests_response.data if requests_response.data else []
        
        # Get request counts
        counts = EventRequestManagement.get_request_counts_by_status()
        
        return render_template(
            "osas_event_request_management.html",
            user=user,
            requests=requests,
            counts=counts
        )
        
    except Exception as e:
        flash(f"Error loading requests: {str(e)}", "danger")
        return render_template(
            "osas_event_request_management.html",
            user=user,
            requests=[],
            counts={"Pending": 0, "Approved": 0, "Rejected": 0, "Cancelled": 0}
        )


def approve_event_request():
    """Approve an event request with schedule conflict check"""
    if "user_email" not in session:
        flash("Please login first.", "warning")
        return redirect(url_for("user.login"))
    
    user_response = User.get_user_by_email(session["user_email"])
    if not user_response.data:
        flash("User not found.", "danger")
        return redirect(url_for("user.login"))
    
    user = user_response.data[0]
    
    if user["role"] != "osas":
        flash("Access denied.", "danger")
        return redirect(url_for("home"))
    
    request_id = request.args.get("request_id")
    
    if not request_id:
        flash("Request ID is required.", "danger")
        return redirect(url_for("event_request_management.view_event_requests"))
    
    try:
        # Approve the request (includes conflict check)
        success, message = EventRequestManagement.approve_request(request_id)
        
        if success:
            flash(message, "success")
        else:
            flash(message, "danger")
            
    except Exception as e:
        flash(f"Error processing request: {str(e)}", "danger")
    
    return redirect(url_for("event_request_management.view_event_requests"))


def reject_event_request():
    """Reject an event request"""
    if "user_email" not in session:
        flash("Please login first.", "warning")
        return redirect(url_for("user.login"))
    
    user_response = User.get_user_by_email(session["user_email"])
    if not user_response.data:
        flash("User not found.", "danger")
        return redirect(url_for("user.login"))
    
    user = user_response.data[0]
    
    if user["role"] != "osas":
        flash("Access denied.", "danger")
        return redirect(url_for("home"))
    
    request_id = request.args.get("request_id")
    
    if not request_id:
        flash("Request ID is required.", "danger")
        return redirect(url_for("event_request_management.view_event_requests"))
    
    try:
        # Reject the request
        success, message = EventRequestManagement.reject_request(request_id)
        
        if success:
            flash(message, "success")
        else:
            flash(message, "danger")
            
    except Exception as e:
        flash(f"Error processing request: {str(e)}", "danger")
    
    return redirect(url_for("event_request_management.view_event_requests"))