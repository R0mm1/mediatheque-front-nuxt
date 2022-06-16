import { container } from 'tsyringe'
import RequestService from '~/assets/ts/service/RequestService'
import { FileDownloadTokenItem } from '~/assets/ts/models/mediatheque/FileDownloadToken'

export default class BookWithFileHelper {
  downloadBookFile (
    fileName: string,
    fileUrl: string,
    fileDownloadTokenUrl: string
  ) {
    const requestService = container.resolve(RequestService)
    const request = requestService.createRequest(fileDownloadTokenUrl, 'POST')
      .setBody({
        file: fileUrl
      })
    requestService.execute<FileDownloadTokenItem>(request)
      .then((response: FileDownloadTokenItem) => {
        BookWithFileHelper.triggerDownload(
          requestService.getApiEndpoint() + '/' + fileUrl + '?t=' + response.token, fileName
        )
      })
  }

  private static triggerDownload (url: string, fileName: string) {
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}
