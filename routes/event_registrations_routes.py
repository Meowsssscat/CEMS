from flask import Blueprint
from controllers import event_registrations_controller

event_registrations_bp = Blueprint("event_registrations", __name__)

event_registrations_bp.route("/department/event-registrations", methods=["GET"])(event_registrations_controller.view_event_registrations)
event_registrations_bp.route("/department/event-registration-details", methods=["GET"])(event_registrations_controller.view_event_registration_details)
event_registrations_bp.route("/department/approve-registration", methods=["GET"])(event_registrations_controller.approve_registration)
event_registrations_bp.route("/department/reject-registration", methods=["GET"])(event_registrations_controller.reject_registration)
event_registrations_bp.route("/department/cancel-event", methods=["GET"])(event_registrations_controller.cancel_department_event)
event_registrations_bp.route("/department/postpone-event", methods=["GET", "POST"])(event_registrations_controller.postpone_department_event)