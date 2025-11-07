// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

document.addEventListener('DOMContentLoaded', function() {
  const toggler = document.getElementById('mobile-nav');
  const navCollapse = document.querySelector('.navbar-collapse');
  if (toggler && navCollapse) {
    toggler.addEventListener('click', function() {
      navCollapse.classList.toggle('active');
    });
  }
});