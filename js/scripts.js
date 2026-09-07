/*!
    Title: Dev Portfolio Template
    Version: 1.2.1
    Last Change: 08/27/2017
    Author: Ryan Fitzgerald
    Repo: https://github.com/RyanFitzgerald/devportfolio-template
    Issues: https://github.com/RyanFitzgerald/devportfolio-template/issues

    Description: This file contains all the scripts associated with the single-page
    portfolio website.
*/

(function ($) {
  // Remove no-js class
  $("html").removeClass("no-js");

  // Animate to section when nav is clicked
  $("header a").click(function (e) {
    // Treat as normal link if no-scroll class
    if ($(this).hasClass("no-scroll")) return;

    e.preventDefault();
    var heading = $(this).attr("href");
    var scrollDistance = $(heading).offset().top;

    $("html, body").animate(
      {
        scrollTop: scrollDistance + "px",
      },
      1500
    );

    // Hide the menu once clicked if mobile
    if ($("header").hasClass("active")) {
      $("header, body").removeClass("active");
    }
  });

  // Scroll to top
  $("#to-top").click(function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      500
    );
  });

  // Scroll to first element
  $("#lead-down span").click(function () {
    var scrollDistance = $("#lead").next().offset().top;
    $("html, body").animate(
      {
        scrollTop: scrollDistance + "px",
      },
      500
    );
  });

  // Turn any [data-carousel] container into a one-at-a-time carousel. Each
  // direct child div is a slide; a .carousel-body inside a slide scrolls.
  $("[data-carousel]").each(function () {
    var $carousel = $(this);
    var $slides = $carousel.children("div").addClass("carousel-slide");
    var total = $slides.length;
    var label = $carousel.attr("data-carousel-label") || "Carousel";

    if (!total) return;

    $carousel
      .addClass("carousel")
      .attr({
        role: "region",
        "aria-label": label,
        tabindex: "0",
      })
      .children()
      .wrapAll('<div class="carousel-viewport"></div>');

    // A lone slide needs no controls
    if (total < 2) {
      $slides.addClass("is-active");
      return;
    }

    // Build the prev/next arrows and the position dots
    var $dots = $('<div class="carousel-dots"></div>');
    $slides.each(function (i) {
      $dots.append(
        $('<button type="button" class="carousel-dot"></button>').attr(
          "aria-label",
          i + 1 + " of " + total + ": " + $.trim($(this).find("h3").text())
        )
      );
    });

    var $prev = $(
      '<button type="button" class="carousel-nav carousel-prev" aria-label="Previous">' +
        '<i class="fa fa-chevron-left" aria-hidden="true"></i></button>'
    );
    var $next = $(
      '<button type="button" class="carousel-nav carousel-next" aria-label="Next">' +
        '<i class="fa fa-chevron-right" aria-hidden="true"></i></button>'
    );

    $carousel.append(
      $('<div class="carousel-controls"></div>').append($prev, $dots, $next)
    );

    var $allDots = $dots.children();
    var current = 0;

    function goTo(index) {
      current = ((index % total) + total) % total; // wrap in both directions

      $slides
        .removeClass("is-active")
        .attr("aria-hidden", "true")
        .eq(current)
        .addClass("is-active")
        .attr("aria-hidden", "false")
        .find(".carousel-body")
        .scrollTop(0); // always start a slide at the top

      $allDots
        .removeClass("is-active")
        .attr("aria-selected", "false")
        .eq(current)
        .addClass("is-active")
        .attr("aria-selected", "true");
    }

    $prev.click(function () {
      goTo(current - 1);
    });

    $next.click(function () {
      goTo(current + 1);
    });

    $allDots.click(function () {
      goTo($(this).index());
    });

    $carousel.keydown(function (e) {
      if (e.which !== 37 && e.which !== 39) return;
      e.preventDefault();
      goTo(e.which === 37 ? current - 1 : current + 1);
    });

    // Swipe between slides, without stealing vertical scrolling inside a card
    var startX = null;
    var startY = null;

    $carousel
      .find(".carousel-viewport")
      .on("touchstart", function (e) {
        var touch = e.originalEvent.touches[0];
        startX = touch.pageX;
        startY = touch.pageY;
      })
      .on("touchend", function (e) {
        if (startX === null) return;

        var touch = e.originalEvent.changedTouches[0];
        var dx = touch.pageX - startX;
        var dy = touch.pageY - startY;

        startX = null;
        startY = null;

        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
          goTo(dx < 0 ? current + 1 : current - 1);
        }
      });

    goTo(0);
  });

  // Open mobile menu
  $("#mobile-menu-open").click(function () {
    $("header, body").addClass("active");
  });

  // Close mobile menu
  $("#mobile-menu-close").click(function () {
    $("header, body").removeClass("active");
  });
})(jQuery);
