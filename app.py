from flask import Flask, redirect, url_for, render_template, session
from routes.user_routes import user_bp
from routes.event_request_routes import event_request_bp
from routes.request_status_routes import request_status_bp
from routes.event_registrations_routes import event_registrations_bp
from routes.event_request_management_routes import event_request_management_bp
from routes.osas_event_management_routes import osas_event_management_bp
from routes.department_event_management_routes import department_event_management_bp
import os

app = Flask(__name__)

# Use environment variable for secret key in production
app.secret_key = os.getenv('SECRET_KEY', 'your_secret_key_fallback_for_local_dev')

# Register blueprints
app.register_blueprint(user_bp)
app.register_blueprint(event_request_bp)
app.register_blueprint(request_status_bp)
app.register_blueprint(event_registrations_bp)
app.register_blueprint(event_request_management_bp)
app.register_blueprint(osas_event_management_bp)
app.register_blueprint(department_event_management_bp)


@app.route("/")
def home():
    return redirect(url_for("user.login"))

@app.route("/student/dashboard")
def student_dashboard():
    if "user_email" not in session:
        return redirect(url_for("user.login"))
    return "Student Dashboard"

@app.route("/department/dashboard")
def department_dashboard():
    if "user_email" not in session:
        return redirect(url_for("user.login"))
    return render_template("base_department.html")

@app.route("/osas/dashboard")
def osas_dashboard():
    if "user_email" not in session:
        return redirect(url_for("user.login"))
    return render_template("base_osas.html")

if __name__ == "__main__":
    # Get port from environment variable (Render sets this)
    port = int(os.getenv('PORT', 5000))
    # Debug mode off in production
    debug_mode = os.getenv('FLASK_ENV') == 'development'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)