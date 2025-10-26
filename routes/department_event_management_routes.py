from flask import Blueprint
from controllers import department_event_management_controller

department_event_management_bp = Blueprint("department_event_management", __name__)

department_event_management_bp.route("/department/event-management", methods=["GET"])(department_event_management_controller.view_department_events)
department_event_management_bp.route("/department/cancel-event", methods=["GET"])(department_event_management_controller.cancel_department_event)
department_event_management_bp.route("/department/postpone-event", methods=["GET", "POST"])(department_event_management_controller.postpone_department_event)
