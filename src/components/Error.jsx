const Error = () => {
  return (
    <article id='error-container'>
        <h2 id='error-header' data-shadow='OOPS!'>
          OOPS!
        </h2>
        <section id='error-text'>
          <p>Something went wrong while processing your request.</p>
          <p>Please, check the input and try again!</p>
        </section>
    </article>
  )
}

export default Error