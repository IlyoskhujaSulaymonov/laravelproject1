// Admin Panel JavaScript

$(document).ready(function() {
    // Initialize the admin panel
    initializeSidebar();
    initializeCharts();
    initializeTables();
    initializeForms();
    initializeNotifications();
    
    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000);
});

// Sidebar functionality
function initializeSidebar() {
    // Sidebar toggle functionality
    $('#sidebarCollapse, #sidebarCollapseTop').on('click', function() {
        $('#sidebar').toggleClass('collapsed');
        $('#content').toggleClass('expanded');
        
        // Store sidebar state
        localStorage.setItem('sidebarCollapsed', $('#sidebar').hasClass('collapsed'));
    });
    
    // Restore sidebar state
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        $('#sidebar').addClass('collapsed');
        $('#content').addClass('expanded');
    }
    
    // Mobile sidebar toggle
    $(window).on('resize', function() {
        if ($(window).width() <= 768) {
            $('#sidebar').addClass('mobile-hidden');
        } else {
            $('#sidebar').removeClass('mobile-hidden');
        }
    });
}

// Initialize charts (using Chart.js)
function initializeCharts() {
    // Dashboard stats animation
    $('.stat-number').each(function() {
        const $this = $(this);
        const countTo = parseInt($this.text().replace(/,/g, ''));
        
        $({ countNum: 0 }).animate({
            countNum: countTo
        }, {
            duration: 2000,
            easing: 'swing',
            step: function() {
                $this.text(Math.floor(this.countNum).toLocaleString());
            },
            complete: function() {
                $this.text(countTo.toLocaleString());
            }
        });
    });
    
    // Progress bars animation
    $('.progress-bar').each(function() {
        const $this = $(this);
        const width = $this.attr('aria-valuenow') + '%';
        
        setTimeout(function() {
            $this.animate({ width: width }, 1500);
        }, 500);
    });
}

// Initialize DataTables
function initializeTables() {
    if ($.fn.DataTable) {
        $('.data-table').DataTable({
            responsive: true,
            pageLength: 10,
            dom: '<"row"<"col-sm-6"l><"col-sm-6"f>>' +
                 '<"row"<"col-sm-12"tr>>' +
                 '<"row"<"col-sm-5"i><"col-sm-7"p>>',
            language: {
                search: "",
                searchPlaceholder: "Search records...",
                lengthMenu: "Show _MENU_ entries",
                info: "Showing _START_ to _END_ of _TOTAL_ entries",
                infoEmpty: "No entries found",
                infoFiltered: "(filtered from _MAX_ total entries)"
            },
            drawCallback: function() {
                // Re-initialize tooltips after table draw
                initializeTooltips();
            }
        });
    }
}

// Form handling and validation
function initializeForms() {
    // Form validation
    $('form.needs-validation').on('submit', function(e) {
        if (!this.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        $(this).addClass('was-validated');
    });
    
    // Auto-save functionality
    $('input[data-autosave], textarea[data-autosave], select[data-autosave]').on('change', function() {
        const $this = $(this);
        const field = $this.attr('name');
        const value = $this.val();
        const url = $this.data('autosave-url') || '/admin/autosave';
        
        // Show saving indicator
        $this.after('<small class="text-muted ms-2 saving-indicator">Saving...</small>');
        
        // AJAX save
        $.ajax({
            url: url,
            method: 'POST',
            data: {
                field: field,
                value: value,
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                $('.saving-indicator').text('Saved').removeClass('text-muted').addClass('text-success');
                setTimeout(function() {
                    $('.saving-indicator').fadeOut(function() {
                        $(this).remove();
                    });
                }, 2000);
            },
            error: function() {
                $('.saving-indicator').text('Error saving').removeClass('text-muted').addClass('text-danger');
                setTimeout(function() {
                    $('.saving-indicator').fadeOut(function() {
                        $(this).remove();
                    });
                }, 3000);
            }
        });
    });
}

// Notification system
function initializeNotifications() {
    // Check for new notifications every 30 seconds
    setInterval(checkNotifications, 30000);
    
    // Mark notification as read
    $(document).on('click', '.notification-item', function() {
        const $this = $(this);
        const notificationId = $this.data('id');
        
        if (!$this.hasClass('read')) {
            markNotificationAsRead(notificationId);
            $this.addClass('read');
        }
    });
}

// AJAX Functions
function checkNotifications() {
    $.ajax({
        url: '/admin/notifications/check',
        method: 'GET',
        success: function(response) {
            if (response.count > 0) {
                updateNotificationBadge(response.count);
                updateNotificationList(response.notifications);
            }
        }
    });
}

function markNotificationAsRead(notificationId) {
    $.ajax({
        url: `/admin/notifications/${notificationId}/read`,
        method: 'POST',
        data: {
            _token: $('meta[name="csrf-token"]').attr('content')
        }
    });
}

// CRUD Operations
function deleteRecord(url, confirmMessage) {
    if (confirm(confirmMessage || 'Are you sure you want to delete this record?')) {
        $.ajax({
            url: url,
            method: 'DELETE',
            data: {
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                showAlert('success', 'Record deleted successfully');
                // Reload the current page or update the table
                location.reload();
            },
            error: function() {
                showAlert('error', 'Error deleting record');
            }
        });
    }
}

function updateRecord(url, data, successCallback) {
    $.ajax({
        url: url,
        method: 'PUT',
        data: Object.assign(data, {
            _token: $('meta[name="csrf-token"]').attr('content')
        }),
        success: function(response) {
            showAlert('success', 'Record updated successfully');
            if (successCallback) successCallback(response);
        },
        error: function(xhr) {
            const errors = xhr.responseJSON?.errors;
            if (errors) {
                Object.keys(errors).forEach(field => {
                    showFieldError(field, errors[field][0]);
                });
            } else {
                showAlert('error', 'Error updating record');
            }
        }
    });
}

function createRecord(url, data, successCallback) {
    $.ajax({
        url: url,
        method: 'POST',
        data: Object.assign(data, {
            _token: $('meta[name="csrf-token"]').attr('content')
        }),
        success: function(response) {
            showAlert('success', 'Record created successfully');
            if (successCallback) successCallback(response);
        },
        error: function(xhr) {
            const errors = xhr.responseJSON?.errors;
            if (errors) {
                Object.keys(errors).forEach(field => {
                    showFieldError(field, errors[field][0]);
                });
            } else {
                showAlert('error', 'Error creating record');
            }
        }
    });
}

// Utility Functions
function showAlert(type, message) {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    
    const alert = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <i class="fas ${iconClass} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    $('.main-content .container-fluid').prepend(alert);
    
    // Auto-hide after 5 seconds
    setTimeout(function() {
        $('.alert').first().fadeOut('slow', function() {
            $(this).remove();
        });
    }, 5000);
}

function showFieldError(fieldName, message) {
    const field = $(`[name="${fieldName}"]`);
    field.addClass('is-invalid');
    
    // Remove existing error message
    field.siblings('.invalid-feedback').remove();
    
    // Add new error message
    field.after(`<div class="invalid-feedback">${message}</div>`);
}

function clearFieldErrors() {
    $('.is-invalid').removeClass('is-invalid');
    $('.invalid-feedback').remove();
}

function updateNotificationBadge(count) {
    let badge = $('.notification-badge');
    if (badge.length === 0) {
        badge = $('<span class="badge bg-danger notification-badge">0</span>');
        $('.notification-bell').append(badge);
    }
    badge.text(count);
}

function updateNotificationList(notifications) {
    const list = $('.notification-list');
    list.empty();
    
    notifications.forEach(function(notification) {
        const item = `
            <div class="notification-item ${notification.read ? 'read' : ''}" data-id="${notification.id}">
                <div class="notification-content">
                    <h6>${notification.title}</h6>
                    <p>${notification.message}</p>
                    <small class="text-muted">${notification.time}</small>
                </div>
            </div>
        `;
        list.append(item);
    });
}

// Initialize tooltips and popovers
function initializeTooltips() {
    $('[data-bs-toggle="tooltip"]').tooltip();
    $('[data-bs-toggle="popover"]').popover();
}

// File upload handling
function handleFileUpload(input, previewContainer) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const preview = `<img src="${e.target.result}" class="img-thumbnail" style="max-width: 200px;">`;
            $(previewContainer).html(preview);
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Export functions
function exportToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    const csv = [];
    const rows = table.querySelectorAll('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = [];
        const cols = rows[i].querySelectorAll('td, th');
        
        for (let j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);
        }
        
        csv.push(row.join(','));
    }
    
    const csvContent = 'data:text/csv;charset=utf-8,' + csv.join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', filename || 'export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Search functionality
function initializeSearch() {
    $('.search-input').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        const targetTable = $(this).data('target');
        
        $(`${targetTable} tbody tr`).each(function() {
            const text = $(this).text().toLowerCase();
            if (text.indexOf(searchTerm) === -1) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    });
}

// Initialize on document ready
$(function() {
    initializeTooltips();
    initializeSearch();
});

// Global error handling
$(document).ajaxError(function(event, xhr, settings, error) {
    if (xhr.status === 401) {
        window.location.href = '/login';
    } else if (xhr.status === 403) {
        showAlert('error', 'You do not have permission to perform this action.');
    } else if (xhr.status === 500) {
        showAlert('error', 'An internal server error occurred. Please try again.');
    }
});

// Loading overlay
function showLoading() {
    const overlay = `
        <div id="loading-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div class="spinner"></div>
        </div>
    `;
    $('body').append(overlay);
}

function hideLoading() {
    $('#loading-overlay').remove();
}

// Keyboard shortcuts
$(document).keydown(function(e) {
    // Ctrl+S to save
    if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        $('form:visible').first().submit();
    }
    
    // Esc to close modals
    if (e.keyCode === 27) {
        $('.modal.show').modal('hide');
    }
});