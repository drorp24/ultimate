/** @jsxImportSource @emotion/react */
const styles = {
  root: {
    height: '100vh',
  },
}

const Page = ({ children, ...rest }) => (
  <div css={styles.root} {...rest}>
    {children}
  </div>
)

export default Page
