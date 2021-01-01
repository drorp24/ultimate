/** @jsxImportSource @emotion/react */

const styles = {
  root: theme => ({
    color: theme.palette.text.primary,
    background: theme.palette.background.default,
    lineHeight: '50vw',
    textAlign: 'center',
    fontSize: '5rem',
  }),
}

const File = () => <div css={styles.root}>File</div>

export default File
