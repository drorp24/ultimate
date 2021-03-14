import { useIntl } from 'react-intl'

const useTranslation = () => {
  const intl = useIntl()
  const t = phrase => intl.formatMessage({ id: phrase })
  return t
}

export default useTranslation
