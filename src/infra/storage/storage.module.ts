import { Uploader } from '@/domain/forum/application/storage/uploader'
import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { MinioStorage } from './minio-storage'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: MinioStorage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
