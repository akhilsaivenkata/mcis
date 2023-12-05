/*document.getElementById('review-plans-btn').addEventListener('click', function() {
    fetch('/advisor/review_plans').then(response => response.json()).then(data => {
        document.getElementById('content-area').textContent = JSON.stringify(data);
    });
});*/

/*document.getElementById('finalize-plans-btn').addEventListener('click', function() {
    fetch('/advisor/finalize_plan').then(response => response.json()).then(data => {
        document.getElementById('content-area').textContent = JSON.stringify(data);
    });
});*/

document.getElementById('change-requests-btn').addEventListener('click', function() {
    loadContent('View Change Requests');
});

document.getElementById('schedule-management-btn').addEventListener('click', function() {
    loadContent('Manage Schedules');
});




document.getElementById('finalize-plans-btn').addEventListener('click', function() {
    const contentArea = document.getElementById('content-area');

    // Form for adding a new degree plan
    const addFormHTML = `
        <h3>Add New Degree Plan</h3>
        <form id="add-degree-plan-form">
            <input type="text" name="student_id" placeholder="Student ID" required>
            <input type="text" name="course_code" placeholder="Course Code" required>
            <button type="submit">Add Plan</button>
        </form>
    `;
    contentArea.innerHTML = addFormHTML;

    console.log("reached 1");

    // Load existing degree plans
    loadDegreePlans();

    // Event listener for adding a new degree plan
    document.getElementById('add-degree-plan-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        fetch('/advisor/add_degree_plan', {
            method: 'POST',
            body: formData
        }).then(response => response.json()).then(data => {
            alert(data.message);
            loadDegreePlans();  // Reload the degree plans list
        });
    });
});

function loadDegreePlans() {
    fetch('/admin/manage_degree_plans').then(response => response.json()).then(degreePlans => {
        const contentArea = document.getElementById('content-area');
        const list = document.createElement('ul');
        console.log("reached load degree plans");
        degreePlans.forEach(plan => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                Degree Plan ID: ${plan.id}, Student ID: ${plan.student_id}, Course Code: ${plan.course_code}, Approved: ${plan.approved}
                <button onclick="editDegreePlan(${plan.id})">Edit</button>
                <button onclick="deleteDegreePlan(${plan.id})">Delete</button>
            `;
            list.appendChild(listItem);
        });
        contentArea.appendChild(list);
    });
}

function deleteDegreePlan(planId) {
    // Confirm deletion
    if (confirm("Are you sure you want to delete this degree plan?")) {
        fetch(`/advisor/delete_degree_plan/${planId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadDegreePlans();  // Reload the degree plans list
        });
    }
}


function editDegreePlan(planId) {
    fetch(`/admin/get_degree_plan/${planId}`).then(response => response.json()).then(planData => {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <h2>Edit Degree Plan</h2>
            <form id="edit-degree-plan-form">
                <input type="hidden" name="plan_id" value="${planId}">
                <input type="text" name="student_id" placeholder="Student ID" value="${planData.student_id}" required>
                <input type="text" name="course_code" placeholder="Course Code" value="${planData.course_code}" required>
                <label>
                    Approved:
                    <input type="checkbox" name="approved" ${planData.approved ? 'checked' : ''}>
                </label>
                <button type="submit">Update Plan</button>
            </form>
        `;

        document.getElementById('edit-degree-plan-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            fetch('/advisor/edit_degree_plan', {
                method: 'POST',
                body: formData
            }).then(response => response.json()).then(data => {
                alert(data.message);
                loadDegreePlans();  // Reload the degree plans list
            });
        });
    });
}




function loadContent(content) {
    document.getElementById('content-area').textContent = content + ' content loading...';
    // Here you would typically make an AJAX call to the server to load the content.
    // For now, we are just changing the text.
}
