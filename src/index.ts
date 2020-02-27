// import readline from 'readline'
import blessed from 'blessed'
import App from './App'
import CONFIG from '../rocket_config.json'

const screen = blessed.screen({
    smartCSR: true,
    cursor: {
        artificial: true,
        shape: 'block',
        blink: true,
        color: 'white',
    },
})
// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(_ch, _key) {
    return process.exit(0);
});

if (CONFIG.ROCKET_USERNAME && CONFIG.ROCKET_PASSWORD) {
  let username : string = CONFIG.ROCKET_USERNAME || 'null'
  let password = CONFIG.ROCKET_PASSWORD || 'null'
  new App(screen, username, password)
} else {

  let form = blessed.form({
      top: 'center',
      left: 'center',
      keys: true,
      vi: true,
      width: 50,
      height: 14,
      tags: true,
      border: {
          type: 'line'
      },
  })

  blessed.text({
      parent: form,
      content: ' RockeTTY ',
      left: 'center',
      top: -1
  })

  // username input
  blessed.textbox({
      parent: form,
      name: 'username',
      height: 3,
      inputOnFocus: true,
      border: {
          type: 'line',
      },
  })

  // password input
  blessed.textbox({
      parent: form,
      name: 'password',
      top: 3,
      height: 3,
      inputOnFocus: true,
      censor: true,
      border: {
          type: 'line',
      },
  })

  // password label
  blessed.text({
      parent: form,
      top: 3,
      left: 2,
      content: 'Password',
  })

  // username label
  blessed.text({
      parent: form,
      left: 2,
      content: 'Username',
  })

  let log_in_button = blessed.button({
      parent: form,
      content: 'Log In',
      left: 'centered',
      top: 6,
      height: 3,
      border: {
          type: 'line',
      },
      style: {
          focus: {
              bg: 'white',
          }
      },
  })

  interface FormFeedback {
      username: string
      password: string
  }

  log_in_button.on('press', () => form.submit())
  form.on('submit', (data: FormFeedback) => {
      let username : string = data.username
      let password : string = data.password
      blessed.text({
          parent: screen,
          content: username + ' ' + password
      })
      form.destroy()
      screen.render()
      new App(screen, username, password)
  })

  screen.append(form)
  form.focus()
  screen.render()
}
