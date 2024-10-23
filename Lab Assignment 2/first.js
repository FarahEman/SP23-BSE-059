const url = "https://reqres.in/api/users";

function toggleSection(section) {
    ['create', 'update', 'delete'].forEach(id => document.getElementById(id).style.display = 'none');
    if (section) document.getElementById(section).style.display = 'block';
    document.getElementById("userList").classList.add("d-none");
}

function createUser() {
    const name = $("#createName").val();
    const email = $("#createEmail").val();

    if (name && email) {
        $.post(url, { name, email }, (res) => {
            $("#createResponse").text(`User ${res.name} created successfully!`);
            $("#createName").val("");
            $("#createEmail").val("");
        }).fail(() => {
            $("#createResponse").text("Error creating user. Please try again.");
        });
    } else {
        $("#createResponse").text("Please fill in all fields.");
    }
}

function fetchUsers() {
    toggleSection();
    $("#userList").removeClass("d-none").html("Loading...");

    $.get(url, (res) => {
        if (res && res.data) {
            const users = res.data.map(user => `<pre>{ ID: ${user.id}, Name: ${user.first_name} ${user.last_name}, Email: ${user.email} }</pre>`).join('');
            $("#userList").html(users);
        } else {
            $("#userList").html("No users found.");
        }
    }).fail(() => {
        $("#userList").html("Error fetching users.");
    });
}

function updateUser() {
    const id = $("#updateId").val();
    const name = $("#updateName").val();
    const email = $("#updateEmail").val();

    if (id && name && email) {
        $.ajax({
            url: `${url}/${id}`,
            method: 'PUT',
            data: { name, email },
            success: (res) => {
                $("#updateResponse").text(`User with ID ${id} updated successfully!`);
                $("#updateId").val("");
                $("#updateName").val("");
                $("#updateEmail").val("");
            },
            error: () => {
                $("#updateResponse").text("Error updating user.");
            }
        });
    } else {
        $("#updateResponse").text("Please fill in all fields.");
    }
}

function deleteUser() {
    const id = $("#deleteId").val();

    if (id) {
        $.ajax({
            url: `${url}/${id}`,
            method: 'DELETE',
            success: () => {
                $("#deleteResponse").text(`User with ID ${id} deleted successfully!`);
                $("#deleteId").val("");
            },
            error: () => {
                $("#deleteResponse").text("Error deleting user.");
            }
        });
    } else {
        $("#deleteResponse").text("Please provide a valid User ID.");
    }
}
