// Example: Refresh button logic
document.querySelector(".refresh").addEventListener("click", () => {
  alert("Refreshing articles... (demo only)");
});

// Example: Translate button
document.querySelectorAll(".actions button:first-child").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("Translate feature coming soon!");
  });
});
