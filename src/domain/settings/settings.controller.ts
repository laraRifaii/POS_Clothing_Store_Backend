import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Patch, 
  Post, 
  UploadedFile, 
  UseInterceptors,
  UsePipes,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe 
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateStoreInfoDto } from './dto/create.dto';
import { UpdateStoreInfoDto } from './dto/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('store-info')
export class SettingsController {
  constructor(private readonly storeInfoService: SettingsService) {}

  @Post()
  create(@Body() dto: CreateStoreInfoDto) {
    return this.storeInfoService.createStoreInfo(dto);
  }

  @Get()
  getStore() {
    return this.storeInfoService.getStore();
  }

  @Patch()
  update(@Body() dto: UpdateStoreInfoDto) {
    return this.storeInfoService.update(dto);
  }
@Patch('logo')
@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = './uploads';
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = extname(file.originalname);
      const filename = `logo-${uniqueSuffix}${ext}`;
      cb(null, filename);
    }
  }),
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
}))
async uploadLogo(
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB only
      ],
    }),
  )
  file: Express.Multer.File,
) {
  
  const logoUrl = `uploads/${file.filename}`;
  return this.storeInfoService.uploadLogo(logoUrl);
}
  @Delete()
  remove() {
    return this.storeInfoService.remove();
  }
}