import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachemnts-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'
import { UploadAndCreateAttachmentsUseCase } from './upload-and-create-attachment'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader

let sut: UploadAndCreateAttachmentsUseCase

describe('Upload and create attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentsUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })

  it('shloud be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'image.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'image.png',
      }),
    )
  })

  it('shloud not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'audio.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  })
})
