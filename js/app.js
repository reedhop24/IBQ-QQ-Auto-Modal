$('Document').ready(function() {
    $('#button1').on('click', function() {
        var payload = {
            "Customer":[
                {
                    "AppLastName":"Hopkins",
                    "AppFirstName":"Reed",
                    "AppEmail":"reed@ibqsystems.com",
                    "AppBirthDate":"1995-09-19",
                    "YearsCurAdd":3,
                    "MailSameAsLoc":"Yes",
                    "ResidenceType":"Owned Dwelling",
                    "AgencyReferral": "Internet"}
                ],
            "Phone":[
                    {
                        "Type":"Home",
                        "Number":"509-720-6633"
                    }
                ],
            "Address":[
                {
                    "Type":"Location",
                    "Address":$('#addr').val(),
                    "City":$('#city').val(),
                    "State":$('#state').val(),
                    "Zip":$('#zip').val(),
                    "Verified":""
        }]}
        $.ajax({
            url: 'https://test.ibqagents.com/ACME:webrate/Auto/StartQuote/'+ $('#zip').val() +'.json',
            type: 'POST',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            processData: false,
            data: JSON.stringify(payload),
            error: function(err){
              console.log(err);
            },
          })    
          .then(function(response) {
            if (response && response.Status == "Success") {
                form_data['Quote'] = response.Quote;
                form.saved();
              } else if(response && response.Error[0].ErrorMsg == "Address verification error: Bad") {
                $.modal.defaults = {
                  closeExisting: true,    // Close existing modals. Set this to false if you need to stack multiple modal instances.
                  escapeClose: false,      // Allows the user to close the modal by pressing `ESC`
                  clickClose: false,       // Allows the user to close the modal by clicking the overlay
                  closeClass: 'modal-button'
                };
                $('#auto-modal').modal();
                $('#unvalidated-addr').click(function() {
                  payload.Address[0]['Verified'] = 'Bad';
                  $.ajax({
                    url: 'https://test.ibqagents.com/ACME:webrate/Auto/StartQuote/'+ $('#zip').val() +'.json',
                    type: 'POST',
                    contentType: 'application/json;charset=utf-8',
                    dataType: 'json',
                    data: JSON.stringify(payload),
                    error: function(err){
                      console.log(err);
                    },
                  })
                  .then(function () {
                    form_data['Quote'] = response.Quote;
                    form.saved();
                  });
                });
                $('#fix-unvalidated-addr').click(function() {
                  // If user chooses to fix unvalidated Address then clear the Address line
                  $('#addr').val('');
                });
              } else if(response && response.Error[0].ErrorMsg == "Address verification error: BadBox" || response && response.Error[0].ErrorMsg == "Address verification error: Box") {
                $.modal.defaults = {
                  closeExisting: true,    // Close existing modals. Set this to false if you need to stack multiple modal instances.
                  escapeClose: false,      // Allows the user to close the modal by pressing `ESC`
                  clickClose: false,       // Allows the user to close the modal by clicking the overlay
                  closeClass: 'modal-button'
                };
                $('#auto-modal-PO').modal();
                $('#clear-PO').click(function() {
                  form.get_model('AddressLocation').get_field_by_name('Address').reset();
                });
              }
        });
    });
});