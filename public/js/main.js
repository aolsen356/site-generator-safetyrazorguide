// Safety Razor Guide - Main JavaScript

(function() {
    'use strict';

    // Mobile Navigation Toggle
    var navToggle = document.querySelector('.nav-toggle');
    var navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = document.querySelector('.site-header').offsetHeight;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header background on scroll
    var header = document.querySelector('.site-header');
    var scrollThreshold = 50;

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // FAQ Accordion
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
        var question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                // Close other items
                faqItems.forEach(function(otherItem) {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });

    // Savings Calculator
    var calculateBtn = document.getElementById('calculate-btn');

    if (calculateBtn) {
        // Run calculation on page load with default values
        calculateSavings();

        // Run calculation on button click
        calculateBtn.addEventListener('click', calculateSavings);

        // Also run on input change for better UX
        var calcInputs = document.querySelectorAll('.calculator input');
        calcInputs.forEach(function(input) {
            input.addEventListener('change', calculateSavings);
            input.addEventListener('keyup', debounce(calculateSavings, 300));
        });
    }

    function calculateSavings() {
        // Get input values
        var cartridgeCost = parseFloat(document.getElementById('cartridge-cost').value) || 4.50;
        var cartridgesPerMonth = parseInt(document.getElementById('cartridges-month').value) || 4;
        var razorCost = parseFloat(document.getElementById('razor-cost').value) || 40;
        var bladeCost = parseFloat(document.getElementById('blade-cost').value) || 0.15;
        var bladesPerMonth = parseInt(document.getElementById('blades-month').value) || 4;

        // Calculate monthly costs
        var monthlyCartridgeCost = cartridgeCost * cartridgesPerMonth;
        var monthlySafetyRazorCost = bladeCost * bladesPerMonth;
        var monthlySavings = monthlyCartridgeCost - monthlySafetyRazorCost;

        // Calculate yearly savings
        var yearlySafetyRazorCost = monthlySafetyRazorCost * 12;
        var yearlyCartridgeCost = monthlyCartridgeCost * 12;

        var year1Savings = (yearlyCartridgeCost - yearlySafetyRazorCost) - razorCost;
        var year3Savings = (yearlyCartridgeCost * 3) - (yearlySafetyRazorCost * 3) - razorCost;
        var year5Savings = (yearlyCartridgeCost * 5) - (yearlySafetyRazorCost * 5) - razorCost;

        // Calculate break-even point (in months)
        var breakEvenMonths = razorCost / monthlySavings;

        // Update DOM
        document.getElementById('monthly-cartridge').textContent = formatCurrency(monthlyCartridgeCost);
        document.getElementById('monthly-safety').textContent = formatCurrency(monthlySafetyRazorCost);
        document.getElementById('monthly-savings').textContent = formatCurrency(monthlySavings);
        document.getElementById('year1-savings').textContent = formatCurrency(year1Savings);
        document.getElementById('year3-savings').textContent = formatCurrency(year3Savings);
        document.getElementById('year5-savings').textContent = formatCurrency(year5Savings);
        document.getElementById('breakeven-text').innerHTML = 'Break-even point: <strong>' + breakEvenMonths.toFixed(1) + ' months</strong>';
    }

    function formatCurrency(amount) {
        return '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    // Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
        var animatedElements = document.querySelectorAll('.benefit-card, .product-review, .pairing-card, .tip, .body-tip, .scenario-card');

        var observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(function(el) {
            el.classList.add('animate-ready');
            observer.observe(el);
        });
    }

    // Track affiliate link clicks
    document.querySelectorAll('a[href*="amazon.com"]').forEach(function(link) {
        link.addEventListener('click', function() {
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    'event_category': 'affiliate',
                    'event_label': this.href
                });
            }
        });
    });
})();
