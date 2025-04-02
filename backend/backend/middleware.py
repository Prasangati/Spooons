import logging
import traceback
from django.http import HttpResponse

logger = logging.getLogger(__name__)

def debug_exception_middleware(get_response):
    def middleware(request):
        try:
            return get_response(request)
        except Exception as e:
            # Print to console
            traceback.print_exc()
            # Return response so you can see it in the browser too
            return HttpResponse(
                f"<h1>Internal Server Error (500)</h1><pre>{traceback.format_exc()}</pre>",
                status=500
            )
    return middleware
