from flask import Blueprint
from controllers import event_request_management_controller

event_request_management_bp = Blueprint("event_request_management", __name__)

event_request_management_bp.route("/osas/event-request-management", methods=["GET"])(event_request_management_controller.view_event_requests)
event_request_management_bp.route("/osas/approve-event-request", methods=["GET"])(event_request_management_controller.approve_event_request)
event_request_management_bp.route("/osas/reject-event-request", methods=["GET"])(event_request_management_controller.reject_event_request)