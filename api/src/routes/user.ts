import { Request, Response } from "express";
import { Users } from "../models/users";

export const newUser = async (req: Request, res: Response) => {
  const { nickName, userEmail, password, image } = req.body;
  try {
    const newUser = await Users.create({
      nickName,
      userEmail,
      password,
      image,
    });
    res.status(201).json({ msg: "Created", newUser });
  } catch (error) {
    console.log(error);
  }
};

export const allUsers = async (req: Request, res: Response) => {
  const { nickName } = req.query;
  try {
    if (nickName) {
      const findUser = await Users.findOne({ nickName: nickName }).populate([
        "contacts",
        "bloqUsers",
      ]);
      if (findUser) {
        return res.send([findUser]);
      } else {
        return res.send("We could not find that user");
      }
    } else {
      const allUsers = await Users.find().populate(["contacts", "bloqUsers"]);
      return res.json(allUsers);
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateUsers = async (req: Request, res: Response) => {
  const { userId, contactId, contact, nickName, password, image, bloqUserId } =
    req.body;
  try {
    const findUser = await Users.findById(userId).populate("contacts");
    const findUserDos = await Users.findById(contact);
    const blockedUser = await Users.findById(bloqUserId).populate("contacts");

    const alreadyAdded = findUser?.contacts?.filter(
      (e) => e._id?.toString() === contact
    );
    const alreadyBloq = findUser?.bloqUsers?.filter(
      (e) => e._id?.toString() === contact
    );
    if (findUser && findUserDos) {
      if (alreadyAdded?.length !== 0) {
        return res.json({ok:true,msg:"Contact already exist"});
      } else if (alreadyBloq?.length !== 0) {
        return res.send({ok:true,msg:"Contact already blocked"});
      } else {
        await findUser.updateOne({ $push: { contacts: contact } });

        return res.json({ok:true,userId , findUserDos ,msg:"contact created"});
      }
    } else if (!contact && findUser && !contactId && !bloqUserId) {
      await findUser.updateOne({ image, password, nickName });
      let userUpdate = {
        image,
        password,
        nickName,
        userId
      }
      console.log(userUpdate)
      return res.json({ok:true ,userUpdate, msg:"User updated"});
    } else if (findUser && contactId) {
      const filterContact = findUser.contacts?.filter(
        (e) => e._id?.toString() === contactId
      );
      if (filterContact?.length === 1) {
        await findUser.updateOne({ $pull: { contacts: contactId } });
        return res.json({ok:true,contactId,userId, msg:"Contact deleted successfully"});
      } else {
        return res.json({ok:false, msg:"Esta rompiendo"});
      }
    } else if (findUser && bloqUserId) {
      const filterBlocks = findUser.bloqUsers?.filter(
        (e) => e._id?.toString() === bloqUserId
      );
      if (filterBlocks?.length === 0) {
        await findUser.updateOne({ $push: { bloqUsers: bloqUserId } });
        return res.json({ok:true,userId , blockUserId: bloqUserId ,msg:"Contact blocked successfully"});

      } else if (filterBlocks?.length === 1) {
        await findUser.updateOne({ $pull: { bloqUsers: bloqUserId }});
        // await findUser.updateOne({ $push:{contacts: blockedUser}})
        
        return res.json({ok:true,userId ,findUser, blockedUser, blockUserId: bloqUserId ,msg:"Contact unblocked successfully"});
        
      } else {
        return res.send("Contact blocked successfully ");
      }
    } else {
      return res.send("We could not find that user");
    }
  } catch (error) {
    return res.status(404).json({ok:false,msg:error});
  }
};

export const userById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const findUser = await Users.findById(userId);
    if (findUser) {
      return res.send(findUser);
    } else {
      return res.json({ msg: "We could not find that user" });
    }
  } catch (error) {
    console.log(error);
  }
};

