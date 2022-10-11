import { Request, Response } from "express";
import { Messages } from "../models/mensaje";

export const newMessage = async (req: Request, res: Response) => {
  const { textMessage, messageAuthor, chatId } = req.body;
  try {
    const newMessage = await Messages.create({
      textMessage,
      messageAuthor,
      chatId,
    });
    res.status(201).send(newMessage);
  } catch (error) {
    console.log(error);
  }
};

export const messageChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const messages = await Messages.find({
      chatId,
    });
    res.send(messages);
  } catch (error) {
    console.log(error);
  }
};

export const allMessages = async (req: Request, res: Response) => {
  try {
    const allMessages = await Messages.find();
    res.send(allMessages);
  } catch (error) {
    console.log(error);
  }
};
