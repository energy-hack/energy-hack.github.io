(function($){
  $(function(){

    $('.sidenav').sidenav();
    $('.parallax').parallax();

    window.showLoader = className => {
      const button = $(`.${className}`)
      const loader = $(`[data-loader-for=${className}]`)
      const result = $(`[data-result-for=${className}]`)

      loader.removeClass('hide')
      result.addClass('hide')
      button.addClass('hide')
    }

    window.hideLoader = className => {
      const button = $(`.${className}`)
      const loader = $(`[data-loader-for=${className}]`)
      const result = $(`[data-result-for=${className}]`)

      loader.addClass('hide')
      result.addClass('hide')
      button.removeClass('hide')
    }

    window.showResult = (className, resultHTML) => {
      const button = $(`.${className}`)
      const loader = $(`[data-loader-for=${className}]`)
      const result = $(`[data-result-for=${className}]`)

      result.html(resultHTML)

      loader.addClass('hide')
      button.addClass('hide')
      result.removeClass('hide')
    }

    window.refreshOrderForm = () => {
      const { current_load, percent } = updateOrderForm()

      const promised_load = (current_load || 150) * (100 - percent) / 100

      const save_up = (current_load - promised_load) * 3.77

      updateOrderForm({ promised_load, save_up })
    }

    window.updateOrderForm = ({ promised_load, save_up } = {}) => {
      const form = $('.order')

      const _current_load = form.find('#current-load')
      const _promised_load = form.find('#promised-load')

      if (promised_load) _promised_load.text(promised_load)
      if (save_up) $('.save-value').text(save_up.toFixed(2))

      const current_load = parseFloat(_current_load.val())
      const percent = 27 // %

      return { current_load, percent }
    }

    window.submitOrderForm = () => {
      console.log('submit')
    }

    window.updateStatusPage = async (isSilentUpdate) => {
      if ( window.location.pathname !== '/status.html'
        && window.location.pathname !== '/status'
        && window.location.pathname !== '/result.html'
        && window.location.pathname !== '/result') {
        return
      }

      const contractAddress = window.location.hash.slice(1) // "0xa44D6e0d17507cA98794393526ad566441C4A780"

      if (!contractAddress) return console.error('no contract')

      if (!isSilentUpdate) {
        $('#status_page_span_number_1').text('...')
        $('#status_page_span_number_2').text('...')
        $('#status_page_span_number_3').text('...')
        $('#status_page_span_number_4').text('...')
      }

      if (!window.schneider) {
        const contract = await new Contract(web3, contractAddress, _SchneiderABI)

        $('.contract-address').html(`
          <a target="_blank" href="https://rinkeby.etherscan.io/address/${contract.address}">
          ${contract.address}
          </a>
          `)

        window.schneider = contract
      }

      const contract = window.schneider

      // ...
      const t = () => Math.floor(Date.now() / 1000)

      const startTime = await contract.call('startTime')
      const endTime = await contract.call('endTime')

            console.log(startTime)
            console.log(endTime)

      const progress = (t() > endTime) ? 1 : ((t() - startTime) / (endTime - startTime))

      const startMeter = await contract.call('startMeter')

      const curload = await contract.call('curLoad')
      const promised = await contract.call('promisedLoad')

      console.log(startMeter)

      console.log(curload)
      console.log(promised)

      const estimated = (curload) * progress
      console.log(estimated)

      try {

        const lastMeter = await contract.call('getLastMeter')
        console.log(lastMeter)

        const consumed = lastMeter - startMeter

        console.log(consumed)

        const fraction = Number(1 - consumed/estimated) * 100

        $('#status_page_span_number_4').text(Number(consumed).toFixed(0))
        $('.savings-fraction').text(fraction.toFixed(0))

      } catch (err) {
        console.error(err)
      }

      $('.progress-timeline').css({ width: progress * 100 + '%' })

      $('#status_page_span_number_1').text(Number(curload).toFixed(0))
      $('#status_page_span_number_2').text(Number(promised).toFixed(0))
      $('#status_page_span_number_3').text(Number(estimated).toFixed(0))
      // ...

      if (progress == 1) {
        if ( window.location.pathname == '/status.html'
          || window.location.pathname == '/status') {
            window.location = `/result#${contractAddress}`
          }
      }
    }

  }); // end of document ready
})(jQuery); // end of jQuery name space
