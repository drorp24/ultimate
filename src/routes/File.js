/** @jsxImportSource @emotion/react */
import useTranslation from '../i18n/useTranslation'

const styles = {
  root: theme => ({
    color: theme.palette.text.primary,
    background: theme.palette.background.default,
    lineHeight: '50vw',
    textAlign: 'center',
    fontSize: '5rem',
  }),
}

const File = () => <div css={styles.root}>{useTranslation()('file')}</div>

export default File
