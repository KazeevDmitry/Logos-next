import React from 'react'

export default function Auth () {
  return (
    <div style={{marginTop: "200px"}}>
      <h1>Login to your account</h1>
      <div>
      <form method="post" action="/api/login">
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder="test@test.fr" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="********" />
        <button type="submit">Submit</button>
      </form>
    </div>
    </div>
  )
}

