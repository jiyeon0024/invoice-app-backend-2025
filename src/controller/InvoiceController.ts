import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Invoice } from "../entity/Invoice";
import { Item } from "../entity/Items"; // Item 엔티티 추가

export class InvoiceController {
  private invoiceRepository = AppDataSource.getRepository(Invoice);
  private itemRepository = AppDataSource.getRepository(Item); // Item 리포지토리 추가

  // 이메일 형식 검증 함수
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const invoices = await this.invoiceRepository.find({
      relations: ["items"],
    }); // items도 함께 가져옴
    return response.status(200).json(invoices);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      return response.status(400).json({ message: "Invalid ID format" });
    }

    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ["items"], // items도 함께 가져옴
    });

    if (!invoice) {
      return response.status(404).json({ message: "Invoice not found" });
    }

    return response
      .status(200)
      .json({ message: "Invoice fetched successfully", invoice });
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const {
      paymentDue,
      description,
      paymentTerms,
      clientName,
      clientEmail,
      status,
      senderAddress,
      clientAddress,
      items,
      total,
    } = request.body;

    // 이메일 검증
    if (!this.isValidEmail(clientEmail)) {
      return response.status(400).json({ message: "Invalid email format" });
    }

    // Invoice 엔티티 생성
    const invoice = new Invoice();

    invoice.paymentDue = paymentDue;
    invoice.description = description;
    invoice.paymentTerms = paymentTerms;
    invoice.clientName = clientName;
    invoice.clientEmail = clientEmail;
    invoice.status = status;
    invoice.senderAddress = senderAddress; // senderAddress 설정
    invoice.clientAddress = clientAddress; // clientAddress 설정
    invoice.total = total;

    try {
      // 먼저 Invoice를 저장
      const savedInvoice = await this.invoiceRepository.save(invoice);

      // Item 배열 처리
      if (items && Array.isArray(items)) {
        for (const itemData of items) {
          const item = new Item();
          item.name = itemData.name;
          item.quantity = itemData.quantity;
          item.price = itemData.price;
          item.total = itemData.total;
          item.invoice = savedInvoice; // 해당 Item은 방금 생성한 Invoice에 속함

          await this.itemRepository.save(item); // 각 Item을 저장
        }
      }

      return response.status(201).json({
        message: "Invoice created successfully",
        invoice: savedInvoice,
      });
    } catch (error) {
      return response.status(500).json({
        message: "Error saving invoice",
        error: error.message,
      });
    }
  }

  async put(request: Request, response: Response, next: NextFunction) {
    const {
      id,
      paymentDue,
      description,
      paymentTerms,
      clientName,
      clientEmail,
      status,
      senderAddress,
      clientAddress,
      items,
      total,
    } = request.body;

    // 이메일 검증
    if (!this.isValidEmail(clientEmail)) {
      return response.status(400).json({ message: "Invalid email format" });
    }

    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ["items"],
    });

    if (!invoice) {
      return response.status(404).json({ message: "Invoice not found" });
    }

    // 기존 데이터 업데이트

    invoice.paymentDue = paymentDue;
    invoice.description = description;
    invoice.paymentTerms = paymentTerms;
    invoice.clientName = clientName;
    invoice.clientEmail = clientEmail;
    invoice.status = status;
    invoice.senderAddress = senderAddress; // senderAddress 업데이트
    invoice.clientAddress = clientAddress; // clientAddress 업데이트
    invoice.total = total;

    // Invoice 저장
    await this.invoiceRepository.save(invoice);

    // 기존 Item 삭제 후 새로운 항목 추가
    if (items && Array.isArray(items)) {
      // 기존 항목 삭제
      await this.itemRepository.delete({ invoice: { id } });

      // 새 항목 추가
      for (const itemData of items) {
        const item = new Item();
        item.name = itemData.name;
        item.quantity = itemData.quantity;
        item.price = itemData.price;
        item.total = itemData.total;
        item.invoice = invoice; // 해당 Item은 수정된 Invoice에 속함

        await this.itemRepository.save(item); // 각 Item 저장
      }
    }

    return response
      .status(200)
      .json({ message: "Invoice updated successfully", invoice });
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      return response.status(400).json({ message: "Invalid ID format" });
    }

    let invoiceToRemove = await this.invoiceRepository.findOneBy({ id });

    if (!invoiceToRemove) {
      return response.status(404).json({ message: "Invoice not found" });
    }

    // Invoice 삭제 전에 연관된 Item도 삭제
    await this.itemRepository.delete({ invoice: { id } });

    await this.invoiceRepository.remove(invoiceToRemove);

    return response
      .status(200)
      .json({ message: "Invoice removed successfully" });
  }
}
