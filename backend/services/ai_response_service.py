import json

from journal_entries.models import AIFeedback, Resource, Stressor

def process_ai_response(entry_obj, ai_raw_response):
    try:
        ai_data = ai_raw_response

        # Save feedback (OneToOne)
        AIFeedback.objects.create(
            journal_entry=entry_obj,
            feedback=ai_data.get("ai_feedback", "")
        )

        # Save stressors (many stressors per entry)
        for stressor in ai_data.get("stressors", []):
            Stressor.objects.create(
                journal_entry=entry_obj,
                name=stressor
            )

        # Save resources (many per entry)
        for res in ai_data.get("resources", []):
            Resource.objects.create(
                journal_entry=entry_obj,
                name=res.get("name", ""),
                description=res.get("description", ""),
                link=res.get("link", "")
            )

    except Exception as e:
        print(f"Error processing AI response: {e}")


