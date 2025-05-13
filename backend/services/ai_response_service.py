import json

def process_ai_response(entry_obj, ai_raw_response):
    try:
        ai_data = ai_raw_response  
        entry_obj.ai_feedback = ai_data.get("ai_feedback")
        entry_obj.stressors = ai_data.get("stressors", [])
        entry_obj.resources = ai_data.get("resources", [])
        entry_obj.save()
    except Exception as e:
        print(f"Error processing AI response: {e}")

