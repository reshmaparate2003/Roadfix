// Application Data
const vehicleData = [
    {"brand": "Maruti Suzuki", "model": "Alto", "vehicle_type": "4 Wheeler", "category": "Car"},
    {"brand": "Maruti Suzuki", "model": "Swift", "vehicle_type": "4 Wheeler", "category": "Car"},
    {"brand": "Maruti Suzuki", "model": "Dzire", "vehicle_type": "4 Wheeler", "category": "Car"},
    {"brand": "Maruti Suzuki", "model": "Baleno", "vehicle_type": "4 Wheeler", "category": "Car"},
    {"brand": "Maruti Suzuki", "model": "Wagon R", "vehicle_type": "4 Wheeler", "category": "Car"},
    {"brand": "Hyundai", "model": "i10 Nios", "vehicle_type": "4 Wheeler", "category": "Car"},
    {"brand": "Hyundai", "model": "i20", "vehicle_type": "4 Wheeler", "category": "Car"},
    {"brand": "Hyundai", "model": "Creta", "vehicle_type": "4 Wheeler", "category": "Car"},
    {"brand": "Hyundai", "model": "Venue", "vehicle_type": "4 Wheeler", "category": "Car"},
    {"brand": "Tata Motors", "model": "Tiago", "vehicle_type": "4 Wheeler", "category": "Car"},
    {"brand": "Tata Motors", "model": "Nexon", "vehicle_type": "4 Wheeler", "category": "Car"},
    {"brand": "Honda", "model": "Activa 125", "vehicle_type": "2 Wheeler", "category": "Scooter"},
    {"brand": "Honda", "model": "Activa 6G", "vehicle_type": "2 Wheeler", "category": "Scooter"},
    {"brand": "Honda", "model": "Shine", "vehicle_type": "2 Wheeler", "category": "Motorcycle"},
    {"brand": "Hero MotoCorp", "model": "Splendor Plus", "vehicle_type": "2 Wheeler", "category": "Motorcycle"},
    {"brand": "Hero MotoCorp", "model": "Passion Pro", "vehicle_type": "2 Wheeler", "category": "Motorcycle"},
    {"brand": "Bajaj", "model": "Pulsar 150", "vehicle_type": "2 Wheeler", "category": "Motorcycle"},
    {"brand": "Bajaj", "model": "Platina", "vehicle_type": "2 Wheeler", "category": "Motorcycle"},
    {"brand": "TVS", "model": "Jupiter", "vehicle_type": "2 Wheeler", "category": "Scooter"},
    {"brand": "TVS", "model": "Apache RTR 160", "vehicle_type": "2 Wheeler", "category": "Motorcycle"},
    {"brand": "Royal Enfield", "model": "Classic 350", "vehicle_type": "2 Wheeler", "category": "Motorcycle"},
    {"brand": "Yamaha", "model": "FZ-S", "vehicle_type": "2 Wheeler", "category": "Motorcycle"},
    {"brand": "Suzuki", "model": "Access 125", "vehicle_type": "2 Wheeler", "category": "Scooter"}
];

const serviceData = [
    {"category": "Engine Services", "service_name": "Engine Oil Change", "price": 500, "duration": "30 mins"},
    {"category": "Engine Services", "service_name": "Engine Repair", "price": 2500, "duration": "2-3 hours"},
    {"category": "Engine Services", "service_name": "Engine Diagnostics", "price": 800, "duration": "45 mins"},
    {"category": "Electrical Services", "service_name": "Battery Replacement", "price": 3000, "duration": "20 mins"},
    {"category": "Electrical Services", "service_name": "Battery Jump Start", "price": 300, "duration": "10 mins"},
    {"category": "Electrical Services", "service_name": "Wiring Issues", "price": 1500, "duration": "1-2 hours"},
    {"category": "Brake Services", "service_name": "Brake Pad Replacement", "price": 1200, "duration": "45 mins"},
    {"category": "Brake Services", "service_name": "Brake Oil Change", "price": 400, "duration": "20 mins"},
    {"category": "Tire Services", "service_name": "Tire Replacement", "price": 2000, "duration": "30 mins"},
    {"category": "Tire Services", "service_name": "Tire Puncture Repair", "price": 150, "duration": "15 mins"},
    {"category": "Tire Services", "service_name": "Wheel Alignment", "price": 600, "duration": "45 mins"},
    {"category": "AC Services", "service_name": "AC Gas Refill", "price": 1500, "duration": "30 mins"},
    {"category": "AC Services", "service_name": "AC Compressor Repair", "price": 5000, "duration": "2-3 hours"},
    {"category": "Emergency Services", "service_name": "Roadside Assistance", "price": 800, "duration": "30 mins"},
    {"category": "Emergency Services", "service_name": "Towing Service", "price": 1200, "duration": "Variable"},
    {"category": "Regular Maintenance", "service_name": "General Service", "price": 1000, "duration": "1 hour"},
    {"category": "Regular Maintenance", "service_name": "Washing & Cleaning", "price": 300, "duration": "30 mins"}
];

// Application State
class RoadFixApp {
    constructor() {
        this.currentUser = null;
        this.userType = 'customer';
        this.selectedVehicle = null;
        this.selectedServices = [];
        this.currentScreen = 'loginScreen';
        this.bookings = this.loadBookings();
        this.init();
    }

    loadBookings() {
        try {
            return JSON.parse(localStorage.getItem('roadfix_bookings')) || [];
        } catch (e) {
            return [];
        }
    }

    init() {
        this.setupEventListeners();
        this.loadSavedUser();
        this.setMinDate();
    }

    setupEventListeners() {
        // Login functionality
        document.getElementById('customerLoginBtn').addEventListener('click', () => this.selectUserType('customer'));
        document.getElementById('mechanicLoginBtn').addEventListener('click', () => this.selectUserType('mechanic'));
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupLink').addEventListener('click', (e) => this.handleSignup(e));
        
        // Logout buttons
        document.querySelectorAll('[id^="logoutBtn"]').forEach(btn => {
            btn.addEventListener('click', () => this.logout());
        });

        // Vehicle selection
        document.querySelectorAll('.vehicle-card').forEach(card => {
            card.addEventListener('click', () => this.selectVehicleType(card.dataset.type));
        });
        
        document.getElementById('brandSelect').addEventListener('change', (e) => this.loadModels(e.target.value));
        document.getElementById('modelSelect').addEventListener('change', () => this.validateVehicleSelection());
        document.getElementById('fuelSelect').addEventListener('change', () => this.validateVehicleSelection());
        document.getElementById('proceedToServices').addEventListener('click', () => this.proceedToServices());

        // Service selection
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', () => this.toggleCategory(header));
        });
        
        document.getElementById('proceedToBooking').addEventListener('click', () => this.proceedToBooking());

        // Navigation
        document.getElementById('backToVehicle').addEventListener('click', () => this.showScreen('vehicleScreen'));
        document.getElementById('backToServices').addEventListener('click', () => this.showScreen('serviceScreen'));

        // Booking form
        document.getElementById('bookingForm').addEventListener('submit', (e) => this.submitBooking(e));
        document.getElementById('getLocationBtn').addEventListener('click', () => this.getCurrentLocation());

        // Dashboard actions
        const newBookingBtn = document.getElementById('newBookingBtn');
        const emergencyBtn = document.getElementById('emergencyBtn');
        if (newBookingBtn) newBookingBtn.addEventListener('click', () => this.showScreen('vehicleScreen'));
        if (emergencyBtn) emergencyBtn.addEventListener('click', () => this.handleEmergencyService());

        // Modal actions
        document.getElementById('viewDashboardBtn').addEventListener('click', () => this.viewDashboard());
        document.getElementById('trackServiceBtn').addEventListener('click', () => this.trackService());
    }

    selectUserType(type) {
        this.userType = type;
        const customerBtn = document.getElementById('customerLoginBtn');
        const mechanicBtn = document.getElementById('mechanicLoginBtn');
        
        // Reset both buttons
        customerBtn.classList.remove('active', 'btn--primary');
        customerBtn.classList.add('btn--outline');
        mechanicBtn.classList.remove('active', 'btn--primary');
        mechanicBtn.classList.add('btn--outline');
        
        if (type === 'customer') {
            customerBtn.classList.add('active', 'btn--primary');
            customerBtn.classList.remove('btn--outline');
        } else {
            mechanicBtn.classList.add('active', 'btn--primary');
            mechanicBtn.classList.remove('btn--outline');
        }
    }

    handleSignup(e) {
        e.preventDefault();
        alert('Sign up functionality will be available soon! For now, please use any email and password to login.');
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        this.showLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            this.currentUser = {
                email: email,
                type: this.userType,
                name: email.split('@')[0],
                id: Math.random().toString(36).substr(2, 9)
            };
            
            try {
                localStorage.setItem('roadfix_user', JSON.stringify(this.currentUser));
            } catch (e) {
                console.warn('Could not save user to localStorage');
            }
            
            this.showLoading(false);
            
            if (this.userType === 'mechanic') {
                this.showMechanicDashboard();
            } else {
                this.showScreen('vehicleScreen');
            }
        }, 1000);
    }

    loadSavedUser() {
        try {
            const savedUser = localStorage.getItem('roadfix_user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
                this.userType = this.currentUser.type;
                if (this.currentUser.type === 'mechanic') {
                    this.showMechanicDashboard();
                } else {
                    this.showCustomerDashboard();
                }
                return true;
            }
        } catch (e) {
            console.warn('Could not load saved user');
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        this.selectedVehicle = null;
        this.selectedServices = [];
        try {
            localStorage.removeItem('roadfix_user');
        } catch (e) {
            console.warn('Could not remove user from localStorage');
        }
        this.showScreen('loginScreen');
        this.resetForms();
    }

    resetForms() {
        document.getElementById('loginForm').reset();
        document.getElementById('bookingForm').reset();
        document.querySelectorAll('.vehicle-card').forEach(card => card.classList.remove('selected'));
        document.getElementById('vehicleDetails').style.display = 'none';
        this.selectUserType('customer'); // Reset to customer login
    }

    selectVehicleType(type) {
        document.querySelectorAll('.vehicle-card').forEach(card => card.classList.remove('selected'));
        document.querySelector(`[data-type="${type}"]`).classList.add('selected');
        
        this.loadBrands(type);
        document.getElementById('vehicleDetails').style.display = 'block';
    }

    loadBrands(vehicleType) {
        const brands = [...new Set(vehicleData.filter(v => v.vehicle_type === vehicleType).map(v => v.brand))];
        const brandSelect = document.getElementById('brandSelect');
        
        brandSelect.innerHTML = '<option value="">Choose Brand...</option>';
        brands.forEach(brand => {
            brandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
        });
        
        // Reset dependent fields
        document.getElementById('modelSelect').innerHTML = '<option value="">Choose Model...</option>';
        document.getElementById('modelSelect').disabled = true;
        document.getElementById('proceedToServices').disabled = true;
    }

    loadModels(brand) {
        const modelSelect = document.getElementById('modelSelect');
        
        if (!brand) {
            modelSelect.innerHTML = '<option value="">Choose Model...</option>';
            modelSelect.disabled = true;
            document.getElementById('proceedToServices').disabled = true;
            return;
        }

        const selectedVehicleType = document.querySelector('.vehicle-card.selected').dataset.type;
        const models = vehicleData.filter(v => v.brand === brand && v.vehicle_type === selectedVehicleType).map(v => v.model);
        
        modelSelect.innerHTML = '<option value="">Choose Model...</option>';
        models.forEach(model => {
            modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
        });
        
        modelSelect.disabled = false;
        this.validateVehicleSelection();
    }

    validateVehicleSelection() {
        const brand = document.getElementById('brandSelect').value;
        const model = document.getElementById('modelSelect').value;
        const fuel = document.getElementById('fuelSelect').value;
        
        if (brand && model && fuel) {
            this.selectedVehicle = {
                type: document.querySelector('.vehicle-card.selected').dataset.type,
                brand: brand,
                model: model,
                fuel: fuel
            };
            document.getElementById('proceedToServices').disabled = false;
        } else {
            this.selectedVehicle = null;
            document.getElementById('proceedToServices').disabled = true;
        }
    }

    proceedToServices() {
        if (!this.selectedVehicle) {
            alert('Please complete your vehicle selection');
            return;
        }
        this.showScreen('serviceScreen');
        this.displayVehicleInfo();
        this.loadServices();
    }

    displayVehicleInfo() {
        const vehicleInfo = document.getElementById('vehicleInfoDisplay');
        vehicleInfo.innerHTML = `
            <div class="vehicle-info-item"><strong>Type:</strong> ${this.selectedVehicle.type}</div>
            <div class="vehicle-info-item"><strong>Brand:</strong> ${this.selectedVehicle.brand}</div>
            <div class="vehicle-info-item"><strong>Model:</strong> ${this.selectedVehicle.model}</div>
            <div class="vehicle-info-item"><strong>Fuel:</strong> ${this.selectedVehicle.fuel}</div>
        `;
    }

    loadServices() {
        const categories = [...new Set(serviceData.map(s => s.category))];
        
        categories.forEach(category => {
            const categoryServices = serviceData.filter(s => s.category === category);
            const categoryContainer = document.getElementById(category);
            
            if (!categoryContainer) return;
            
            categoryContainer.innerHTML = '';
            categoryServices.forEach(service => {
                const serviceItem = document.createElement('div');
                serviceItem.className = 'service-item';
                serviceItem.innerHTML = `
                    <div class="service-info">
                        <div class="service-name">${service.service_name}</div>
                        <div class="service-details">${service.duration}</div>
                    </div>
                    <div class="service-price">₹${service.price}</div>
                `;
                
                serviceItem.addEventListener('click', () => this.toggleService(service, serviceItem));
                categoryContainer.appendChild(serviceItem);
            });
        });
    }

    toggleCategory(header) {
        const category = header.dataset.category;
        const servicesContainer = document.getElementById(category);
        if (!servicesContainer) return;
        
        const isCollapsed = servicesContainer.classList.contains('collapsed');
        
        if (isCollapsed) {
            servicesContainer.classList.remove('collapsed');
            header.classList.remove('collapsed');
        } else {
            servicesContainer.classList.add('collapsed');
            header.classList.add('collapsed');
        }
    }

    toggleService(service, element) {
        const isSelected = element.classList.contains('selected');
        
        if (isSelected) {
            element.classList.remove('selected');
            this.selectedServices = this.selectedServices.filter(s => s.service_name !== service.service_name);
        } else {
            element.classList.add('selected');
            this.selectedServices.push(service);
        }
        
        this.updateServicesSummary();
    }

    updateServicesSummary() {
        const summaryContainer = document.getElementById('servicesSummary');
        const servicesList = document.getElementById('selectedServicesList');
        const totalCostElement = document.getElementById('totalCost');
        const totalTimeElement = document.getElementById('totalTime');
        
        if (this.selectedServices.length === 0) {
            summaryContainer.style.display = 'none';
            return;
        }
        
        summaryContainer.style.display = 'block';
        
        servicesList.innerHTML = '';
        let totalCost = 0;
        let totalMinutes = 0;
        
        this.selectedServices.forEach(service => {
            const serviceElement = document.createElement('div');
            serviceElement.className = 'selected-service-item';
            serviceElement.innerHTML = `
                <div>
                    <div class="service-name">${service.service_name}</div>
                    <div class="service-details">${service.duration}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="service-price">₹${service.price}</span>
                    <button class="remove-service" onclick="app.removeService('${service.service_name}')">×</button>
                </div>
            `;
            servicesList.appendChild(serviceElement);
            
            totalCost += service.price;
            totalMinutes += this.parseDuration(service.duration);
        });
        
        totalCostElement.textContent = totalCost;
        totalTimeElement.textContent = totalMinutes > 60 ? 
            `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}min` : 
            `${totalMinutes} mins`;
    }

    removeService(serviceName) {
        this.selectedServices = this.selectedServices.filter(s => s.service_name !== serviceName);
        document.querySelectorAll('.service-item').forEach(item => {
            const nameElement = item.querySelector('.service-name');
            if (nameElement && nameElement.textContent === serviceName) {
                item.classList.remove('selected');
            }
        });
        this.updateServicesSummary();
    }

    parseDuration(duration) {
        const match = duration.match(/(\d+)/);
        return match ? parseInt(match[1]) : 30;
    }

    proceedToBooking() {
        if (this.selectedServices.length === 0) {
            alert('Please select at least one service');
            return;
        }
        this.showScreen('bookingScreen');
        this.displayBookingSummary();
    }

    displayBookingSummary() {
        const summaryContent = document.getElementById('bookingSummaryContent');
        const totalCost = this.selectedServices.reduce((sum, service) => sum + service.price, 0);
        
        summaryContent.innerHTML = `
            <div class="summary-item">
                <span>Vehicle:</span>
                <span>${this.selectedVehicle.brand} ${this.selectedVehicle.model}</span>
            </div>
            <div class="summary-item">
                <span>Services:</span>
                <span>${this.selectedServices.length} selected</span>
            </div>
            <div class="summary-item">
                <span><strong>Total Cost:</strong></span>
                <span><strong>₹${totalCost}</strong></span>
            </div>
        `;
    }

    setMinDate() {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        const dateInput = document.getElementById('serviceDate');
        if (dateInput) {
            dateInput.min = dateString;
            dateInput.value = dateString;
        }
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    document.getElementById('serviceLocation').value = 
                        `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
                },
                (error) => {
                    alert('Unable to get your location. Please enter manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    submitBooking(e) {
        e.preventDefault();
        
        const bookingData = {
            id: Math.random().toString(36).substr(2, 9),
            customerId: this.currentUser.id,
            customerName: document.getElementById('customerName').value,
            customerPhone: document.getElementById('customerPhone').value,
            vehicle: this.selectedVehicle,
            services: this.selectedServices,
            location: document.getElementById('serviceLocation').value,
            date: document.getElementById('serviceDate').value,
            time: document.getElementById('serviceTime').value,
            instructions: document.getElementById('specialInstructions').value,
            isEmergency: document.getElementById('emergencyBooking').checked,
            status: 'pending',
            totalCost: this.selectedServices.reduce((sum, service) => sum + service.price, 0),
            createdAt: new Date().toISOString()
        };
        
        this.showLoading(true);
        
        setTimeout(() => {
            this.bookings.push(bookingData);
            try {
                localStorage.setItem('roadfix_bookings', JSON.stringify(this.bookings));
            } catch (e) {
                console.warn('Could not save booking to localStorage');
            }
            
            this.showLoading(false);
            this.showBookingConfirmation(bookingData);
        }, 1500);
    }

    showBookingConfirmation(booking) {
        const confirmationDetails = document.getElementById('bookingConfirmationDetails');
        confirmationDetails.innerHTML = `
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Date & Time:</strong> ${new Date(booking.date).toLocaleDateString()} at ${booking.time}</p>
            <p><strong>Total Cost:</strong> ₹${booking.totalCost}</p>
            <p><strong>Status:</strong> <span class="status-badge status-badge--pending">Pending</span></p>
        `;
        
        document.getElementById('confirmationModal').classList.remove('hidden');
    }

    viewDashboard() {
        document.getElementById('confirmationModal').classList.add('hidden');
        this.showCustomerDashboard();
    }

    trackService() {
        document.getElementById('confirmationModal').classList.add('hidden');
        alert('Service tracking feature will be available soon!');
    }

    showCustomerDashboard() {
        this.showScreen('customerDashboard');
        this.loadCustomerBookings();
        this.loadSavedVehicles();
    }

    showMechanicDashboard() {
        this.showScreen('mechanicDashboard');
        this.loadMechanicStats();
        this.loadBookingRequests();
    }

    loadCustomerBookings() {
        const customerBookings = this.bookings.filter(b => b.customerId === this.currentUser.id);
        const bookingsList = document.getElementById('customerBookingsList');
        
        if (customerBookings.length === 0) {
            bookingsList.innerHTML = '<div class="booking-item text-center">No bookings found. <a href="#" onclick="app.showScreen(\'vehicleScreen\')">Book your first service</a></div>';
            return;
        }
        
        bookingsList.innerHTML = '';
        customerBookings.reverse().forEach(booking => {
            const bookingElement = document.createElement('div');
            bookingElement.className = 'booking-item';
            bookingElement.innerHTML = `
                <div class="booking-header">
                    <strong>${booking.vehicle.brand} ${booking.vehicle.model}</strong>
                    <span class="status-badge status-badge--${booking.status}">${booking.status}</span>
                </div>
                <div class="booking-details">
                    ${booking.services.map(s => s.service_name).join(', ')}<br>
                    📅 ${new Date(booking.date).toLocaleDateString()} at ${booking.time}<br>
                    💰 ₹${booking.totalCost}
                </div>
                <div class="booking-actions">
                    <button class="btn btn--outline btn--sm" onclick="app.viewBookingDetails('${booking.id}')">View Details</button>
                    ${booking.status === 'pending' ? `<button class="btn btn--outline btn--sm" onclick="app.cancelBooking('${booking.id}')">Cancel</button>` : ''}
                </div>
            `;
            bookingsList.appendChild(bookingElement);
        });
    }

    loadMechanicStats() {
        const pendingBookings = this.bookings.filter(b => b.status === 'pending');
        const completedToday = this.bookings.filter(b => 
            b.status === 'completed' && 
            new Date(b.date).toDateString() === new Date().toDateString()
        );
        const totalEarnings = this.bookings
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + b.totalCost, 0);
        
        document.getElementById('pendingCount').textContent = pendingBookings.length;
        document.getElementById('completedCount').textContent = completedToday.length;
        document.getElementById('earningsCount').textContent = totalEarnings;
    }

    loadBookingRequests() {
        const pendingBookings = this.bookings.filter(b => b.status === 'pending');
        const requestsList = document.getElementById('bookingRequestsList');
        
        if (pendingBookings.length === 0) {
            requestsList.innerHTML = '<div class="request-item text-center">No pending requests</div>';
            return;
        }
        
        requestsList.innerHTML = '';
        pendingBookings.forEach(booking => {
            const requestElement = document.createElement('div');
            requestElement.className = 'request-item';
            requestElement.innerHTML = `
                <div class="request-header">
                    <strong>${booking.customerName}</strong>
                    <span class="text-primary">₹${booking.totalCost}</span>
                </div>
                <div class="request-details">
                    🚗 ${booking.vehicle.brand} ${booking.vehicle.model}<br>
                    📅 ${new Date(booking.date).toLocaleDateString()} at ${booking.time}<br>
                    📍 ${booking.location.substring(0, 50)}...<br>
                    🔧 ${booking.services.map(s => s.service_name).join(', ')}
                </div>
                <div class="request-actions">
                    <button class="btn btn--primary btn--sm" onclick="app.acceptBooking('${booking.id}')">Accept</button>
                    <button class="btn btn--outline btn--sm" onclick="app.rejectBooking('${booking.id}')">Reject</button>
                </div>
            `;
            requestsList.appendChild(requestElement);
        });
    }

    acceptBooking(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = 'confirmed';
            booking.mechanicId = this.currentUser.id;
            try {
                localStorage.setItem('roadfix_bookings', JSON.stringify(this.bookings));
            } catch (e) {
                console.warn('Could not save booking updates');
            }
            this.loadBookingRequests();
            this.loadMechanicStats();
            alert('Booking accepted successfully!');
        }
    }

    rejectBooking(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = 'cancelled';
            try {
                localStorage.setItem('roadfix_bookings', JSON.stringify(this.bookings));
            } catch (e) {
                console.warn('Could not save booking updates');
            }
            this.loadBookingRequests();
            this.loadMechanicStats();
            alert('Booking rejected.');
        }
    }

    loadSavedVehicles() {
        let savedVehicles = [];
        try {
            savedVehicles = JSON.parse(localStorage.getItem('roadfix_saved_vehicles')) || [];
        } catch (e) {
            savedVehicles = [];
        }
        
        const vehiclesList = document.getElementById('savedVehiclesList');
        
        if (savedVehicles.length === 0) {
            vehiclesList.innerHTML = '<div class="vehicle-item text-center">No saved vehicles</div>';
            return;
        }
        
        vehiclesList.innerHTML = '';
        savedVehicles.forEach((vehicle, index) => {
            const vehicleElement = document.createElement('div');
            vehicleElement.className = 'vehicle-item';
            vehicleElement.innerHTML = `
                <div class="vehicle-header">
                    <strong>${vehicle.brand} ${vehicle.model}</strong>
                    <button class="btn btn--outline btn--sm" onclick="app.removeVehicle(${index})">Remove</button>
                </div>
                <div class="vehicle-details">
                    ${vehicle.type} • ${vehicle.fuel}
                </div>
            `;
            vehiclesList.appendChild(vehicleElement);
        });
    }

    handleEmergencyService() {
        this.showScreen('vehicleScreen');
        alert('Emergency service selected. Please complete your vehicle and service selection for immediate assistance.');
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        const targetScreen = document.getElementById(screenName);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            if (show) {
                overlay.classList.remove('hidden');
            } else {
                overlay.classList.add('hidden');
            }
        }
    }

    viewBookingDetails(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (booking) {
            alert(`Booking Details:\n\nID: ${booking.id}\nServices: ${booking.services.map(s => s.service_name).join(', ')}\nDate: ${booking.date} at ${booking.time}\nStatus: ${booking.status}\nTotal: ₹${booking.totalCost}`);
        }
    }

    cancelBooking(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (booking && confirm('Are you sure you want to cancel this booking?')) {
            booking.status = 'cancelled';
            try {
                localStorage.setItem('roadfix_bookings', JSON.stringify(this.bookings));
            } catch (e) {
                console.warn('Could not save booking updates');
            }
            this.loadCustomerBookings();
            alert('Booking cancelled successfully.');
        }
    }

    removeVehicle(index) {
        let savedVehicles = [];
        try {
            savedVehicles = JSON.parse(localStorage.getItem('roadfix_saved_vehicles')) || [];
        } catch (e) {
            savedVehicles = [];
        }
        
        if (confirm('Remove this vehicle from your saved list?')) {
            savedVehicles.splice(index, 1);
            try {
                localStorage.setItem('roadfix_saved_vehicles', JSON.stringify(savedVehicles));
            } catch (e) {
                console.warn('Could not save vehicle updates');
            }
            this.loadSavedVehicles();
        }
    }
}

// Initialize the application
const app = new RoadFixApp();

// Global functions for onclick handlers
window.app = app;