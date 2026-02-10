async function predictImage(imageFile) {
  const apiUrl = import.meta.env.VITE_API_URL; // Replace with your API URL

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during prediction:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

// Example Usage (assuming you have an input element with id="imageInput"):
const imageInput = document.getElementById("imageInput");
imageInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const result = await predictImage(file);
      console.log("Prediction Result:", result);

      // Display the Grad-CAM image
      const gradcamImage = document.getElementById("gradcamImage");
      gradcamImage.src = `data:image/jpeg;base64,${result.gradcam_image}`;
      gradcamImage.style.display = "block";

      // Display the predicted class and explanation
      document.getElementById("predictionResult").innerHTML = `
          <p>Predicted Class: ${result.predicted_class}</p>
          <p>Explanation: ${result.explanation}</p>
        `;
    } catch (error) {
      // Handle the error appropriately (e.g., display an error message to the user)
      console.error("Prediction failed:", error);
      document.getElementById("predictionResult").innerHTML =
        `<p>Error: ${error.message}</p>`;
    }
  }
});
