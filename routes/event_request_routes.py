from flask import Blueprint
from controllers import event_request_controller

event_request_bp = Blueprint("event_request", __name__)

event_request_bp.route("/department/request_event", methods=["GET", "POST"])(event_request_controller.request_event)