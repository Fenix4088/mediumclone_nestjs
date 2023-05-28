import { Injectable } from '@nestjs/common';
import { TagEntity } from '@app/tag/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}
  async findAll(): Promise<{ tags: TagEntity[] }> {
    const tags = await this.tagRepository.find({ select: { name: true } });
    return { tags };
  }
}
