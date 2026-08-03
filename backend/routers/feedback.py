from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models.schemas import FeedbackCreate, FeedbackUpdate, FeedbackResponse
from services.supabase_client import supabase, verify_token

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.get("", response_model=List[dict])
def get_user_feedback(user=Depends(verify_token)):
    """
    GET /feedback
    Fetch all feedback entries submitted by the currently authenticated user.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection uninitialized")

    try:
        response = (
            supabase.from_("feedback")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", desc=True)
            .execute()
        )
        return response.data
    except Exception as e:
        print("Error fetching feedback:", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch feedback: {str(e)}"
        )

@router.post("", status_code=status.HTTP_201_CREATED)
def create_new_feedback(payload: FeedbackCreate, user=Depends(verify_token)):
    """
    POST /feedback
    Create a new feedback record bound to the authenticated user's ID.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection uninitialized")

    try:
        data_to_insert = {
            "user_id": user.id,
            "name": payload.name.strip(),
            "course": payload.course.strip(),
            "rating": payload.rating,
            "feedback": payload.feedback.strip()
        }

        response = supabase.from_("feedback").insert([data_to_insert]).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Could not create feedback record.")

        return response.data[0]
    except Exception as e:
        print("Error creating feedback:", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create feedback: {str(e)}"
        )

@router.put("/{feedback_id}")
def update_existing_feedback(
    feedback_id: str,
    payload: FeedbackUpdate,
    user=Depends(verify_token)
):
    """
    PUT /feedback/{feedback_id}
    Update an existing feedback entry owned by the authenticated user.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection uninitialized")

    try:
        update_data = {}
        if payload.name is not None:
            update_data["name"] = payload.name.strip()
        if payload.course is not None:
            update_data["course"] = payload.course.strip()
        if payload.rating is not None:
            update_data["rating"] = payload.rating
        if payload.feedback is not None:
            update_data["feedback"] = payload.feedback.strip()

        if not update_data:
            raise HTTPException(status_code=400, detail="No fields provided to update.")

        # Update record matching feedback_id AND user_id
        response = (
            supabase.from_("feedback")
            .update(update_data)
            .eq("id", feedback_id)
            .eq("user_id", user.id)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback record not found or permission denied."
            )

        return response.data[0]
    except Exception as e:
        print("Error updating feedback:", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update feedback: {str(e)}"
        )

@router.delete("/{feedback_id}", status_code=status.HTTP_200_OK)
def delete_user_feedback(feedback_id: str, user=Depends(verify_token)):
    """
    DELETE /feedback/{feedback_id}
    Delete a feedback entry owned by the authenticated user.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection uninitialized")

    try:
        response = (
            supabase.from_("feedback")
            .delete()
            .eq("id", feedback_id)
            .eq("user_id", user.id)
            .execute()
        )

        return {"message": "Feedback deleted successfully", "id": feedback_id}
    except Exception as e:
        print("Error deleting feedback:", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete feedback: {str(e)}"
        )
