/* 
=========================================
   INTERACTIVE JAVASCRIPT CONTROLLER
   Project: Rentalease Holidays
=========================================
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. STICKY NAVBAR SCROLL ACTION
    // ==========================================
    const navbar = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle (Simplified interaction)
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            alert("Mobile menu opened! In a full deployment, this toggles a sliding side navigation bar.");
        });
    }

    // ==========================================
    // 2. HERO SEARCH CARD WIDGET TABS
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const searchPanes = document.querySelectorAll('.search-form-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Toggle Active Tab Button
            tabButtons.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');

            // Toggle Active Form Pane
            searchPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `${targetTab}-pane`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // Main Search CTA Click
    const searchMainBtn = document.getElementById('searchMainBtn');
    if (searchMainBtn) {
        searchMainBtn.addEventListener('click', () => {
            const activeTab = document.querySelector('.tab-btn.active span').textContent;
            alert(`Searching for available ${activeTab}... This would redirect you to search results in our live reservation system.`);
        });
    }

    // ==========================================
    // 3. OFFERS CAROUSEL SLIDER (AUTO-SCROLL)
    // ==========================================
    const offersSlider = document.getElementById('offersSlider');
    const prevBtn = document.getElementById('offersPrevBtn');
    const nextBtn = document.getElementById('offersNextBtn');
    
    if (offersSlider && prevBtn && nextBtn) {
        let slideIndex = 0;
        const cardWidth = 380 + 24; // Card width + gap
        const totalCards = offersSlider.children.length;
        
        const updateSliderPosition = () => {
            // Determine max slide index based on screen width
            const viewportWidth = document.querySelector('.offers-slider-viewport').offsetWidth;
            const visibleCards = Math.floor(viewportWidth / cardWidth) || 1;
            const maxIndex = Math.max(0, totalCards - visibleCards);
            
            if (slideIndex > maxIndex) slideIndex = maxIndex;
            if (slideIndex < 0) slideIndex = 0;
            
            offersSlider.style.transform = `translateX(-${slideIndex * cardWidth}px)`;
        };

        nextBtn.addEventListener('click', () => {
            const viewportWidth = document.querySelector('.offers-slider-viewport').offsetWidth;
            const visibleCards = Math.floor(viewportWidth / cardWidth) || 1;
            const maxIndex = Math.max(0, totalCards - visibleCards);
            
            if (slideIndex < maxIndex) {
                slideIndex++;
            } else {
                slideIndex = 0; // Loop back
            }
            updateSliderPosition();
        });

        prevBtn.addEventListener('click', () => {
            if (slideIndex > 0) {
                slideIndex--;
            } else {
                const viewportWidth = document.querySelector('.offers-slider-viewport').offsetWidth;
                const visibleCards = Math.floor(viewportWidth / cardWidth) || 1;
                slideIndex = Math.max(0, totalCards - visibleCards); // Jump to end
            }
            updateSliderPosition();
        });

        // Adjust position on screen resize
        window.addEventListener('resize', updateSliderPosition);

        // Auto Scroll (every 5 seconds)
        let autoScrollTimer = setInterval(() => {
            nextBtn.click();
        }, 5000);

        // Pause auto scroll on hover
        const sliderViewport = document.querySelector('.offers-slider-viewport');
        sliderViewport.addEventListener('mouseenter', () => clearInterval(autoScrollTimer));
        sliderViewport.addEventListener('mouseleave', () => {
            autoScrollTimer = setInterval(() => {
                nextBtn.click();
            }, 5000);
        });
    }

    // ==========================================
    // 4. TRENDING VACATIONS DESTINATION FILTER
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const destCards = document.querySelectorAll('.dest-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterVal = btn.getAttribute('data-filter');
            
            // Toggle Active Filter Class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Apply filter to cards
            destCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterVal === 'all' || category === filterVal) {
                    card.style.display = 'block';
                    // Trigger simple entry scale-up animation
                    card.style.animation = 'none';
                    setTimeout(() => card.style.animation = 'scaleUp 0.3s ease forwards', 10);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Add keyframe animation for filter updates dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes scaleUp {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
    `;
    document.head.appendChild(styleSheet);

    // ==========================================
    // 5. AI-POWERED TRAVEL ITINERARY PLANNER
    // ==========================================
    const generatePlanBtn = document.getElementById('generatePlanBtn');
    const plannerPlaceholder = document.getElementById('plannerPlaceholder');
    const itineraryContent = document.getElementById('itineraryContent');
    const daysTimeline = document.getElementById('daysTimeline');
    
    // Select selectors
    const planDest = document.getElementById('planDest');
    const planBudget = document.getElementById('planBudget');
    const planDuration = document.getElementById('planDuration');
    const planVibe = document.getElementById('planVibe');

    // Labels/Output Elements
    const itineraryTitle = document.getElementById('itineraryTitle');
    const itineraryTag = document.getElementById('itineraryTag');
    const itineraryEstCost = document.getElementById('itineraryEstCost');
    const itineraryLodging = document.getElementById('itineraryLodging');
    
    // Database of Itinerary Points
    const travelDatabase = {
        "Agra": {
            baseMultiplier: 1.0,
            lodging: {
                Budget: "Zostel Agra / Backpacker Homestays",
                Comfort: "Howard Plaza The Fern (4 Star)",
                Luxury: "The Oberoi Amarvilas (5 Star Luxury)"
            },
            days: {
                Relaxation: [
                    "Arrival at hotel. Enjoy leisure evening walk around Sadar Bazaar followed by dynamic Taj Mahal sunset view.",
                    "Slow morning. Visit the magnificent Taj Mahal with a certified historian guide. Have high-tea with Taj views.",
                    "Visit Agra Fort and shop for intricate marble embroidery handicrafts. Relish local sweets (Petha) at Panchhi Petha.",
                    "Explore Mehtab Bagh gardens overlooking the Yamuna river. Enjoy resort spa facilities.",
                    "Excursion to Fatehpur Sikri ghost city palace. Afternoon departure via Express Highway."
                ],
                Adventure: [
                    "Arrive in Agra. Evening cycling tour around the countryside fields overlooking the Taj dome.",
                    "Early sunrise Taj tour. Afternoon wildlife safari at the Soor Sarovar Bird Sanctuary and Bear Rescue Center.",
                    "Explore the labyrinth corridors of Agra Fort. Go on a local food quest through old lanes of Kinari Bazaar.",
                    "Excursion trek to Chambal Sanctuary for gharial crocodile boat safaris and ravines discovery.",
                    "Excursion to Fatehpur Sikri and Buland Darwaza ruins. Departure."
                ],
                Cultural: [
                    "Arrive and check in. Watch the romantic 'Mohabbat-the-Taj' live musical theatre play at Kalakriti.",
                    "Detailed Taj Mahal history expedition. Visit the tomb of Itimad-ud-Daulah (Baby Taj).",
                    "Agra Fort tour, focusing on Shah Jahan's confinement quarters. Traditional marble inlay artisan workshop tour.",
                    "Explore Sikandra (Tomb of Akbar). Culinary street-food walking tour sampling bedai and kachori.",
                    "Morning walk in old Agra city spice market. Buy Agra leather items and depart."
                ],
                Family: [
                    "Arrive in Agra. Family resort pool party. Light show evening walk near Taj corridor.",
                    "Grand Taj Mahal guided tour. Kids photography activity in gardens.",
                    "Agra Fort exploration and family dinner at a classic Muglai restaurant.",
                    "Visit Mehtab Bagh gardens and enjoy horse carriage (Tanga) rides near the monuments.",
                    "Explore Fatehpur Sikri palace and Akbar's royal courtyards. Drive back home."
                ]
            }
        },
        "Thailand": {
            baseMultiplier: 1.8,
            lodging: {
                Budget: "Lub d Phuket Patong (Premium Hostel)",
                Comfort: "Novotel Resort Phuket Karon Beach (4 Star)",
                Luxury: "Banyan Tree Phuket DoublePool Villas (5 Star)"
            },
            days: {
                Relaxation: [
                    "Arrival at Phuket Airport. VIP transfer to resort. Quiet evening cocktail on Karon Beach.",
                    "Complete resort wellness day. Balinese aroma massage, beach yoga, and sunset beachfront dinner.",
                    "Afternoon private cruise around Phang Nga Bay limestone cliffs. Quiet sunset swim.",
                    "Leisure walks in Phuket Old Town, exploring colorful Sino-Portuguese cafes and art galleries.",
                    "Morning souvenir buying on Bangla road. Private luxury transfer to airport."
                ],
                Adventure: [
                    "Arrive in Phuket. Rent a scooter to explore viewpoints (Kata Noi, Karon Viewpoint).",
                    "Speedboat day trip to Phi Phi Islands, Bamboo Island, and Maya Bay. Snorkeling with blacktip reef sharks.",
                    "Jungle ziplining at Hanuman World and ATV riding through mud trails in Phuket hills.",
                    "Whitewater rafting and sea kayaking around Phang Nga caves and James Bond Island.",
                    "Scuba diving trip to Racha Islands. Evening flight departure."
                ],
                Cultural: [
                    "Arrive in Phuket. Check in and visit the traditional Phuket Sunday Walking Street market.",
                    "Visit the massive Big Buddha hilltop statue and Wat Chalong Temple. Learn Buddhist history.",
                    "Thai Culinary School half-day cooking class. Visit Phuket Thai Hua Museum.",
                    "Discover rubber plantations, visit a local pineapple farm, and watch a Muay Thai match.",
                    "Morning Buddhist offering ceremony at a temple. Depart for airport."
                ],
                Family: [
                    "Arrive in Phuket. Relaxing resort check-in. Evening at Carnival Magic amusement park.",
                    "Family island tour to Coral Island via catamaran. Banana boat rides and coral sighting.",
                    "Visit Phuket Elephant Sanctuary. Feed, wash, and walk with rescued elephants.",
                    "Splash Jungle Waterpark family fun. Evening buffet at Phuket FantaSea show.",
                    "Leisure poolside hours and departure flight back."
                ]
            }
        },
        "Maldives": {
            baseMultiplier: 3.5,
            lodging: {
                Budget: "Kaani Grand Seaview Maafushi (Boutique Beachfront)",
                Comfort: "Bandos Maldives Island Resort (4 Star)",
                Luxury: "Soneva Jani / Anantara Kihavah Overwater Villas (5 Star Luxe)"
            },
            days: {
                Relaxation: [
                    "Arrive in Male. Seaplane transfer to resort. Check in to overwater villa. Champagne welcome.",
                    "Leisure day. Hammock reading, private lagoon swimming, and luxury resort spa package.",
                    "Sunset sandbar dining. Yacht cruise chasing dolphins with private butler.",
                    "Floating breakfast in your villa pool. Relaxing reef-side massage.",
                    "Sunrise yoga. Luxury speedboat transfer back to Male Airport."
                ],
                Adventure: [
                    "Arrive in Male. Speedboat transfer to Maafushi. Evening night fishing excursion.",
                    "Scuba diving session at Banana Reef. Snorkel with giant manta rays and whale sharks.",
                    "Jet ski safaris, windsurfing, and wakeboarding at the water sports hub.",
                    "Full-day resort excursion. Shipwreck diving and coral garden restoration volunteering.",
                    "Morning paddleboarding, check-out, and airport departure."
                ],
                Cultural: [
                    "Arrive in Male. Guided walking tour of Male city, visiting Old Friday Mosque and Local Fish Market.",
                    "Transfer to local inhabited island. Stay in a local guest house to experience Dhivehi food.",
                    "Traditional Boduberu drum performance evening. Learn local coconut palm weaving.",
                    "Traditional dhoni boat sailing. Learn Maldivian pole-and-line tuna fishing.",
                    "Buy handcrafted lacquerware boxes. Speedboat to Male airport for flight."
                ],
                Family: [
                    "Arrive in Male. Resort transfer. Kids club welcome games. Family beach stroll.",
                    "Guided family snorkeling safari right off the house reef. Underwater photo session.",
                    "Semi-submarine tour to view deep-sea turtles. Family beach barbecue dinner.",
                    "Island treasure hunt organized by the resort. Outdoor cinema movie night under stars.",
                    "Leisure pool swimming, souvenir packing, and flight back."
                ]
            }
        },
        "Switzerland": {
            baseMultiplier: 4.5,
            lodging: {
                Budget: "Balmers Hostel Interlaken (Budget Lodge)",
                Comfort: "Hotel Du Nord Interlaken (4 Star)",
                Luxury: "Victoria-Jungfrau Grand Hotel & Spa (5 Star Luxury)"
            },
            days: {
                Relaxation: [
                    "Arrive in Zurich. Scenic train ride to Interlaken. Check in to premium alpine chalet.",
                    "Leisure day. Scenic cruise on Lake Brienz. Evening stroll around Höhematte park.",
                    "Excursion to Grindelwald First. Cable car ride, walk on the Cliff Walk. Coffee in mountain view cafe.",
                    "Explore Lauterbrunnen Valley (valley of 72 waterfalls). Relax at hotel thermal baths.",
                    "Scenic train ride to Zurich, souvenir shopping, and flight departure."
                ],
                Adventure: [
                    "Arrive in Interlaken. Paragliding flight landing right in the middle of Interlaken lawns.",
                    "Trek around Jungfrau region. Visit Trümmelbach glacier waterfalls inside the caves.",
                    "Grindelwald First adventure: First Glider, Mountain Cart, and Trottibike scooter rides.",
                    "Canyoning in Swiss gorges or skydiving over Interlaken lakes.",
                    "Eiger Trail hiking tour. Check out and return train transfer."
                ],
                Cultural: [
                    "Arrive in Interlaken. Local cheese fondue cooking masterclass and dining.",
                    "Excursion train to Jungfraujoch - Top of Europe. Tour the Ice Palace and Sphinx Observatory.",
                    "Day trip to historic Lucerne. Walk the Chapel Bridge and visit Swiss Museum of Transport.",
                    "Swiss chocolate making workshop at Funky Chocolate Club. Visit local woodcarving village Brienz.",
                    "Visit Oberhofen Castle on Lake Thun. Scenic return trip."
                ],
                Family: [
                    "Arrive in Interlaken. Swiss chalets settlement. Family board games night with views.",
                    "Excursion to Harder Kulm (top of Interlaken) for kids fun park and panoramas.",
                    "Visit Ballenberg Open-Air Museum to see historic houses and farm animals.",
                    "Jungfrau train ride. Snow tubing and playing in the snow park on top of Europe.",
                    "Scenic boat ride on Lake Thun, packing up, and airport train."
                ]
            }
        },
        "Bali": {
            baseMultiplier: 2.0,
            lodging: {
                Budget: "Arya Wellness Retreat Ubud (Boutique Hostel)",
                Comfort: "Alaya Resort Ubud (4 Star Tropical Resort)",
                Luxury: "Mandapa, a Ritz-Carlton Reserve (5 Star Luxury Sanctuary)"
            },
            days: {
                Relaxation: [
                    "Arrival at Denpasar. Transfer to Ubud jungle villa. Evening flower bath session.",
                    "Ubud spa retreat: Balinese massage, organic food dining, and sunset stroll in Campuhan Ridge.",
                    "Visit Tegallalang Rice Terraces and swing over the valleys. Sunset cocktail at infinity pool.",
                    "Day trip to Seminyak for boutique shopping and sunset mocktails at Potato Head Beach Club.",
                    "Morning yoga. Buy organic coffee, Ubud art items, and drive to airport."
                ],
                Adventure: [
                    "Arrive in Bali. Check in. Evening white river rafting safety brief.",
                    "Early morning Mount Batur sunrise volcanic trekking. Relax in natural hot springs afterwards.",
                    "Whitewater rafting on the Ayung River. Zipline over deep forest ravines.",
                    "Scuba diving or snorkeling around Nusa Penida to swim with giant manta rays.",
                    "ATV quad biking through Balinese caves and waterfalls. Flight departure."
                ],
                Cultural: [
                    "Arrive in Ubud. Attend the traditional Kecak fire dance drama at Ubud Palace.",
                    "Visit Tirta Empul Holy Water Temple. Participate in traditional purificatory ritual.",
                    "Balinese culinary masterclass. Visit Ubud art market to see wood carvers.",
                    "Explore Goa Gajah (Elephant Cave) and Royal Temple Taman Ayun. Learn Balinese philosophy.",
                    "Visit Uluwatu cliff temple. Sunset watch and airport transfer."
                ],
                Family: [
                    "Arrive in Ubud. Check-in. Family dinner at a organic garden cafe.",
                    "Visit Ubud Monkey Forest (feed monkeys carefully) and take family photos.",
                    "Bali Safari & Marine Park day outing. Jungle cruises and animal encounters.",
                    "Waterbom Bali waterpark slide day in Kuta. Family sunset walk on Jimbaran beach.",
                    "Morning villa pool fun, souvenir buying, and departure."
                ]
            }
        }
    };

    if (generatePlanBtn) {
        generatePlanBtn.addEventListener('click', () => {
            const dest = planDest.value;
            const budget = planBudget.value;
            const duration = parseInt(planDuration.value, 10);
            const vibe = planVibe.value;

            // Trigger spinner animation on button
            const icon = generatePlanBtn.querySelector('i');
            icon.classList.add('fa-spin');
            generatePlanBtn.disabled = true;

            setTimeout(() => {
                // Generate Details
                const db = travelDatabase[dest];
                const destinationName = planDest.options[planDest.selectedIndex].text.split('(')[0].trim();
                
                // Calculate Dynamic Cost
                let basePerDay = 0;
                if (budget === 'Budget') basePerDay = 2800;
                else if (budget === 'Comfort') basePerDay = 6500;
                else if (budget === 'Luxury') basePerDay = 16000;

                const totalCost = Math.round(duration * basePerDay * db.baseMultiplier);
                const recommendedHotel = db.lodging[budget];

                // Populate Summary
                itineraryTitle.innerText = `${duration} Days in ${dest}`;
                itineraryTag.innerText = `${vibe} Theme • ${budget} Class`;
                itineraryEstCost.innerText = `₹${totalCost.toLocaleString('en-IN')}`;
                itineraryLodging.innerText = recommendedHotel;

                // Populate Days Timeline
                daysTimeline.innerHTML = '';
                const activitiesList = db.days[vibe] || db.days['Relaxation'];

                for (let i = 0; i < duration; i++) {
                    const dayNum = i + 1;
                    const activity = activitiesList[i % activitiesList.length];
                    
                    let dayTitle = "";
                    if (dayNum === 1) dayTitle = "Arrival & Briefing";
                    else if (dayNum === duration) dayTitle = "Souvenirs & Departure";
                    else dayTitle = `Explore & Experience - Day ${dayNum}`;

                    const itemHtml = `
                        <div class="timeline-item">
                            <div class="day-badge">D${dayNum}</div>
                            <div class="timeline-details">
                                <h4>${dayTitle}</h4>
                                <p>${activity}</p>
                            </div>
                        </div>
                    `;
                    daysTimeline.insertAdjacentHTML('beforeend', itemHtml);
                }

                // Swap displays
                plannerPlaceholder.classList.add('hidden');
                itineraryContent.classList.remove('hidden');

                // Unlock button
                icon.classList.remove('fa-spin');
                generatePlanBtn.disabled = false;
                
                // Scroll slightly to timeline on mobile
                if (window.innerWidth < 768) {
                    itineraryContent.scrollIntoView({ behavior: 'smooth' });
                }

            }, 1000); // 1-second simulated algorithm wait
        });
    }

    // Print Itinerary button
    const itineraryPrintBtn = document.getElementById('itineraryPrintBtn');
    if (itineraryPrintBtn) {
        itineraryPrintBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // ==========================================
    // 6. ENQUIRY / BOOKING MODALS FLOW
    // ==========================================
    const enquiryModal = document.getElementById('enquiryModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const enquiryForm = document.getElementById('enquiryForm');
    const submitFormBtn = document.getElementById('submitFormBtn');
    const modalSuccessBox = document.getElementById('modalSuccessBox');
    const successOkBtn = document.getElementById('successOkBtn');
    
    const enquiryPackageName = document.getElementById('enquiryPackageName');
    const formPackageName = document.getElementById('formPackageName');
    const usrName = document.getElementById('usrName');
    const usrEmail = document.getElementById('usrEmail');
    const usrPhone = document.getElementById('usrPhone');
    const usrMessage = document.getElementById('usrMessage');

    // Function to Open Modal
    const openEnquiryModal = (packageName) => {
        enquiryPackageName.innerText = `Package: ${packageName}`;
        formPackageName.value = packageName;
        
        // Reset form and views
        enquiryForm.classList.remove('hidden');
        modalSuccessBox.classList.add('hidden');
        enquiryForm.reset();
        
        // Show overlay
        enquiryModal.classList.add('active');
    };

    // Attach to destination cards Enquire buttons
    const enquireButtons = document.querySelectorAll('.enquire-btn');
    enquireButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const packName = btn.getAttribute('data-package') || "General Tour";
            openEnquiryModal(packName);
        });
    });

    // Attach to Booking Itinerary planner button
    const bookItineraryBtn = document.getElementById('bookItineraryBtn');
    if (bookItineraryBtn) {
        bookItineraryBtn.addEventListener('click', () => {
            const dest = planDest.value;
            const duration = planDuration.value;
            const vibe = planVibe.value;
            const pClass = planBudget.value;
            openEnquiryModal(`Customized ${duration} Days ${dest} (${vibe} - ${pClass})`);
        });
    }

    // Close Modal Event
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            enquiryModal.classList.remove('active');
        });
    }

    if (successOkBtn) {
        successOkBtn.addEventListener('click', () => {
            enquiryModal.classList.remove('active');
        });
    }

    // Close Modal on Overlay Click
    window.addEventListener('click', (e) => {
        if (e.target === enquiryModal) {
            enquiryModal.classList.remove('active');
        }
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });

    // Form Submission with Loading animation
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Perform simple validation check
            if (!usrName.value || !usrEmail.value || !usrPhone.value) {
                alert("Please fill in all required fields.");
                return;
            }

            // Spinner styling during submittals
            const btnText = document.getElementById('submitBtnText');
            btnText.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;
            submitFormBtn.disabled = true;

            setTimeout(() => {
                // Return button back to standard
                btnText.innerHTML = `Submit Enquiry`;
                submitFormBtn.disabled = false;

                // Hide Form and Show Success
                enquiryForm.classList.add('hidden');
                modalSuccessBox.classList.remove('hidden');

            }, 1500); // 1.5s simulated network request
        });
    }

    // ==========================================
    // 7. LOGIN MODAL FLOW
    // ==========================================
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const loginModalCloseBtn = document.getElementById('loginModalCloseBtn');

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }

    if (loginModalCloseBtn) {
        loginModalCloseBtn.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
    }

});
