import {  Controller, Delete, Get, OperationId, Post, Route, SuccessResponse, Tags } from "tsoa"

@Route('ingestion')
@Tags('Ingestion')
export class CreateSubjectController extends Controller {
	@Post()
	@OperationId('create-ingestion')
	@SuccessResponse('201', 'Created')
	public async createIngestion(): Promise<any> {
		this.setStatus(500)
		return { error: 'Endpoint not implemented yet'}
	}

	@Delete("{id}")
	@OperationId('delete-ingestion')
	@SuccessResponse('201', 'Created')
	public async deleteIngestion(): Promise<any> {
	  this.setStatus(500)
    return { error: 'Endpoint not implemented yet'}
  }

  @Get("{id}")
  @OperationId('get-ingestion')
  @SuccessResponse('201', 'Created')
  public async getIngestion(): Promise<any> {
    this.setStatus(500)
    return { error: 'Endpoint not implemented yet'}
  }

  @Get()
  @OperationId('get-ingestions')
  @SuccessResponse('201', 'Created')
  public async getIngestions(): Promise<any> {
    this.setStatus(500)
    return { error: 'Endpoint not implemented yet'}
  }
}
