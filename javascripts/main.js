console.log('This would be the main JS file.');

jQuery(document).ready(function() {
  jQuery(".solution").wrap("<div class = 'spoiler'></div>")
  jQuery(".solution").before("<p class = 'teaser'>Afficher la solution</p>")
  jQuery(".solution").hide();
  jQuery(document).on('click', '.teaser', function() {
    jQuery(this).next(".solution").slideToggle(500);
  });
});
