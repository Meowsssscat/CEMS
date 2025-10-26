from flask import render_template, request, redirect, url_for, flash, session
from models.event_management import EventManagement
from models.user import User

def view_all_events():
    """Display all events for OSAS management"""
    if "user_email" not in session:
        flash("Please login first.", "warning")
        return redirect(url_for("user.login"))
    
    user_response = User.get_user_by_email(session["user_email"])
    if not user_response.data:
        flash("User not found.", "danger")
        return redirect(url_for("user.login"))
    
    user = user_response.data[0]
    
    if user["role"] != "osas":
        flash("Access denied. OSAS accounts only.", "danger")
        return redirect(url_for("home"))
    
    try:
        # Get all events
        events_response = EventManagement.get_all_events()
        events = events_response.data if events_response.data else []
        
        # Get event counts
        counts = EventManagement.get_event_counts_by_status()
        
        # Get filter from query parameters
        status_filter = request.args.get("status", "all")
        
        # Filter events if needed
        if status_filter != "all":
            events = [e for e in events if e["status"].lower() == status_filter.lower()]
        
        return render_template(
            "osas_event_management.html",
            user=user,
            events=events,
            counts=counts,
            status_filter=status_filter
        )
        
    except Exception as e:
        flash(f"Error loading events: {str(e)}", "danger")
        return render_template(
            "osas_event_management.html",
            user=user,
            events=[],
            counts={"Active": 0, "Completed": 0, "Cancelled": 0},
            status_filter="all"
        )


def cancel_osas_event():
    """Cancel any event (OSAS has override authority)"""
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
    
    event_id = request.args.get("event_id")
    
    if not event_id:
        flash("Event ID is required.", "danger")
        return redirect(url_for("osas_event_management.view_all_events"))
    
    try:
        success, message = EventManagement.cancel_event(event_id)
        
        if success:
            flash(message, "success")
        else:
            flash(message, "danger")
            
    except Exception as e:
        flash(f"Error cancelling event: {str(e)}", "danger")
    
    return redirect(url_for("osas_event_management.view_all_events"))


def postpone_osas_event():
    """Postpone/reschedule any event (OSAS has override authority)"""
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
    
    event_id = request.args.get("event_id")
    
    if not event_id:
        flash("Event ID is required.", "danger")
        return redirect(url_for("osas_event_management.view_all_events"))
    
    try:
        # Get event details
        event_response = EventManagement.get_event_by_id(event_id)
        if not event_response.data:
            flash("Event not found.", "danger")
            return redirect(url_for("osas_event_management.view_all_events"))
        
        event = event_response.data[0]
        
        if request.method == "POST":
            new_date = request.form.get("new_date")
            new_start_time = request.form.get("new_start_time")
            new_end_time = request.form.get("new_end_time")
            
            if not all([new_date, new_start_time, new_end_time]):
                flash("Please provide all required fields.", "danger")
                return render_template("osas_postpone_event.html", user=user, event=event)
            
            success, message = EventManagement.postpone_event(event_id, new_date, new_start_time, new_end_time)
            
            if success:
                flash(message, "success")
                return redirect(url_for("osas_event_management.view_all_events"))
            else:
                flash(message, "danger")
        
        return render_template("osas_postpone_event.html", user=user, event=event)
        
    except Exception as e:
        flash(f"Error: {str(e)}", "danger")
        return redirect(url_for("osas_event_management.view_all_events"))