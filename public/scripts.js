function skrytZpravu(id) {
    

    $.ajax({
        
      url: '/skrytZpravu',
      type: 'POST',
      data: { id_zprava : id },
      success: function () {
        location.reload();
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseText);
      }
    });
  }