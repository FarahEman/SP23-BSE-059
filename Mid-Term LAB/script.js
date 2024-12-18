// JavaScript to toggle project description visibility
const projectDescriptions = {
    1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eget ipsum ut libero ornare pellentesque.",
    2: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
};

function toggleDescription(projectId) {
    const descriptionElement = document.getElementById(`description${projectId}`);
    if (descriptionElement.style.display === "block") {
        descriptionElement.style.display = "none";
    } else {
        descriptionElement.style.display = "block";
        descriptionElement.textContent = projectDescriptions[projectId];
    }
}
