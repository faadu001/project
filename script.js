document.addEventListener('DOMContentLoaded', function() {
    const symptomInput = document.getElementById('symptomInput');
    const suggestionsDiv = document.getElementById('suggestions');
    const selectedSymptomsDiv = document.getElementById('selectedSymptoms');
    const form = document.getElementById('symptomForm');
    const healthIcon = document.getElementById('health-icon');

    const symptoms = [
        'Headache', 'Fever', 'Cough', 'Fatigue', 'Shortness of breath',
        'Nausea', 'Vomiting', 'Diarrhea', 'Muscle pain', 'Sore throat'
    ];

    let selectedSymptoms = new Set();

    function initAnimations() {
        gsap.from(healthIcon, { 
            opacity: 0, 
            y: -50, 
            duration: 1, 
            ease: "power3.out",
            onComplete: () => {
                gsap.to(healthIcon, {
                    y: 10,
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut"
                });
            }
        });
        gsap.from("#form-title", { opacity: 0, y: -20, duration: 0.5, delay: 0.5 });
        gsap.from("#symptomForm", { opacity: 0, y: 20, duration: 0.5, delay: 0.7 });
    }

    initAnimations();

    symptomInput.addEventListener('input', function() {
        const inputValue = this.value.toLowerCase().trim();
        suggestionsDiv.innerHTML = '';

        if (inputValue.length === 0) {
            displayMessage("Write your symptoms");
            return;
        }

        const matchedSymptoms = symptoms.filter(symptom => 
            symptom.toLowerCase().includes(inputValue)
        );

        if (matchedSymptoms.length > 0) {
            suggestionsDiv.style.display = 'block';
            matchedSymptoms.forEach(symptom => {
                const div = document.createElement('div');
                div.textContent = symptom;
                div.className = 'p-2 hover:bg-gray-100 cursor-pointer';
                div.onclick = function() {
                    addSymptom(symptom);
                };
                suggestionsDiv.appendChild(div);
            });
            gsap.to(suggestionsDiv, { height: 'auto', opacity: 1, duration: 0.3, ease: "power2.out" });
        } else {
            displayMessage("No symptoms recognized");
        }
    });

    function displayMessage(message) {
        suggestionsDiv.innerHTML = `<div class="p-2 text-gray-600">${message}</div>`;
        gsap.to(suggestionsDiv, { height: 'auto', opacity: 1, duration: 0.3, ease: "power2.out", display: 'block' });
    }

    function addSymptom(symptom) {
        if (selectedSymptoms.has(symptom)) {
            displayMessage("Symptom already chosen");
            return;
        }
        selectedSymptoms.add(symptom);
        updateSelectedSymptoms();
        symptomInput.value = '';
        suggestionsDiv.style.display = 'none';
    }

    function updateSelectedSymptoms() {
        selectedSymptomsDiv.innerHTML = '';
        selectedSymptoms.forEach(symptom => {
            const div = document.createElement('div');
            div.className = 'inline-block bg-teal-200 rounded-full px-3 py-1 text-sm font-semibold text-teal-700 mr-2 mb-2';
            div.textContent = symptom;
            const removeButton = document.createElement('button');
            removeButton.textContent = '×';
            removeButton.className = 'ml-2 text-teal-500 hover:text-teal-700 focus:outline-none';
            removeButton.onclick = function() {
                selectedSymptoms.delete(symptom);
                gsap.to(div, { 
                    opacity: 0, 
                    scale: 0.5, 
                    duration: 0.3, 
                    ease: "power2.in",
                    onComplete: () => {
                        div.remove();
                        updateSelectedSymptoms();
                    }
                });
            };
            div.appendChild(removeButton);
            selectedSymptomsDiv.appendChild(div);
            gsap.from(div, { opacity: 0, scale: 0, duration: 0.3, ease: "power2.out" });
        });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (selectedSymptoms.size === 0) {
            alert("Please select at least one symptom before analyzing.");
            return;
        }
        
        
        const analyzeButton = form.querySelector('button[type="submit"]');
        analyzeButton.disabled = true;
        const originalText = analyzeButton.textContent;
        analyzeButton.textContent = "Analyzing...";
        

        gsap.to(analyzeButton, {
            scale: 1.05,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });

        setTimeout(() => {
            const symptoms = Array.from(selectedSymptoms).join(',');
            window.location.href = `result.html?symptoms=${encodeURIComponent(symptoms)}`;
        }, 2000);
    });
});
