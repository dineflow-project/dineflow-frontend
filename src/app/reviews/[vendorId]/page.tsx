"use client";
import ReviewService from "@/services/ReviewService";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Review } from "@/Interfaces/ReviewInterface"; // Import the Review interface

export default function Review({ params }: { params: { vendorId: bigint } }) {
  const strVendorId = params.vendorId.toString();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgScore, setAvgScore] = useState<Number>();
  const [newReview, setNewReview] = useState({
    score: 0,
    description: "",
  });

  // Fetch reviews data
  useEffect(() => {
    if (!params.vendorId) {
      return;
    }

    ReviewService.getReviewByVendorId(strVendorId)
      .then((reviewRes) => {
        if (!reviewRes.data) return;
        setReviews(reviewRes.data);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Cannot get Review", "error");
      });

    ReviewService.getAvgReviewScoreByVendorId(strVendorId)
      .then((scoreRes) => {
        if (!scoreRes.data) return;
        setAvgScore(scoreRes.data);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Cannot get Average Score", "error");
      });
  }, [params.vendorId]);

  const handleReviewSubmit = () => {
    // Submit the new review
    ReviewService.createReview({
      score: newReview.score,
      description: newReview.description,
      vendor_id: strVendorId,
    })
      .then((response) => {
        console.log("Review submitted successfully", response.data);
        //get New avg score
        ReviewService.getAvgReviewScoreByVendorId(strVendorId).then(
          (scoreRes) => {
            if (!scoreRes.data) return;
            setAvgScore(scoreRes.data);
          }
        );

        // Refresh reviews after successful submission
        ReviewService.getReviewByVendorId(strVendorId).then((reviewRes) => {
          if (!reviewRes.data) return;
          setReviews(reviewRes.data);
        });

        // Reset the form
        setNewReview({
          score: 0,
          description: "",
        });
        // Display a success message
        Swal.fire("Success", "Review submitted successfully", "success");
      })
      .catch((error) => {
        console.error("Error submitting review", error);
        Swal.fire("Error", "Failed to submit review", "error");
      });
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-xl font-bold mb-4">Submit a Review</h2>
      <form className="max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Score:
          </label>
          <select
            value={newReview.score}
            onChange={(e) =>
              setNewReview({ ...newReview, score: parseInt(e.target.value) })
            }
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Description:
          </label>
          <textarea
            value={newReview.description}
            onChange={(e) =>
              setNewReview({ ...newReview, description: e.target.value })
            }
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <button
          type="button"
          onClick={handleReviewSubmit}
          className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
        >
          Submit Review
        </button>
      </form>

      <h1 className="text-xl font-bold mt-8">Reviews for Vendor</h1>
      <h3> Average Score: {avgScore ? avgScore.toFixed(2) : "no review"}</h3>

      <div>
        {/* Display existing reviews */}
        {reviews.map((review, index) => (
          <div
            key={index}
            className="mb-4 p-4 border border-gray-300 rounded-md"
          >
            <p className="text-lg font-semibold">Score: {review.score}</p>
            <p className="text-gray-600">Description: {review.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
