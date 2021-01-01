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

const Dashboard = () => <div css={styles.root}>Dashboard</div>

export default Dashboard
