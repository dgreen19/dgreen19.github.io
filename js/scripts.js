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

  // Create experience carousel
  $("#experience-carousel").each(function () {
    var $carousel = $(this);
    var $slides = $carousel.children("div");
    var total = $slides.length;

    if (!total) return;

    // Build the header of each slide from its h3/h4 and data-date
    $slides.each(function () {
      var $slide = $(this).addClass("exp-slide");
      var date = $slide.data("date");
      var $head = $('<div class="exp-slide-head"></div>');

      $head.append($slide.children("h3"), $slide.children("h4"));

      // Add the date to the header if it exists
      if (date) {
        $head.append('<span class="exp-date">' + date + "</span>");
      }

      $slide.prepend($head);
    });

    $carousel
      .addClass("exp-carousel")
      .attr({
        role: "region",
        "aria-label": "Work experience",
        tabindex: "0",
      })
      .children()
      .wrapAll('<div class="exp-viewport"></div>');

    // A lone role needs no controls
    if (total < 2) {
      $slides.addClass("is-active");
      return;
    }

    // Build the prev/next arrows and the position dots
    var $dots = $('<div class="exp-dots"></div>');
    $slides.each(function (i) {
      $dots.append(
        $('<button type="button" class="exp-dot"></button>').attr(
          "aria-label",
          "Role " + (i + 1) + ": " + $.trim($(this).find("h3").text())
        )
      );
    });

    var $prev = $(
      '<button type="button" class="exp-nav exp-prev" aria-label="Previous role">' +
        '<i class="fa fa-chevron-left" aria-hidden="true"></i></button>'
    );
    var $next = $(
      '<button type="button" class="exp-nav exp-next" aria-label="Next role">' +
        '<i class="fa fa-chevron-right" aria-hidden="true"></i></button>'
    );

    $carousel.append(
      $('<div class="exp-controls"></div>').append($prev, $dots, $next)
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
        .find(".exp-body")
        .scrollTop(0); // always start a role at the top

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

    // Swipe between roles, without stealing vertical scrolling inside a card
    var startX = null;
    var startY = null;

    $carousel
      .find(".exp-viewport")
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

  // Load additional projects
  $("#view-more-projects").click(function (e) {
    e.preventDefault();
    $(this).fadeOut(300, function () {
      $("#more-projects").fadeIn(300);
    });
  });
})(jQuery);
