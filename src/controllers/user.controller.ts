import { PrismaClient, roles } from "@prisma/client";
import { Request, Response } from "express";
import argon2 from "argon2";
import { hash } from "crypto";
import { generateToken } from "../helpers/jwt";

const prisma = new PrismaClient();

// export const createUser = async (req: Request, res: Response) => {
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstname, lastname, email, password } = req.body as {
      firstname: string;
      lastname: string;
      email: string;
      password: string;
    };

    if (!firstname || !lastname || !email || !password) {
      res.status(400).json({ message: "Validation error." });
    }

    const existingUser = await prisma.users.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingUser) {
      res.status(409).json({ message: "Email already in use." });
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = await prisma.users.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "Success",
      result: {
        id: newUser.id,
        Firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, plainPassword } = req.body as {
      email: string;
      plainPassword: string;
    };

    if (!email || !plainPassword) {
      res.status(400).json({ message: "Validation error" });
      return;
    }

    // Check if user exists
    const checkUsr = await prisma.users.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!checkUsr) {
      res.status(401).json({ message: "Failed to login" });
      return;
    }

    // Check password
    const isValidPassword = await argon2.verify(
      checkUsr.password,
      plainPassword
    );

    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid login attempt!" });
      return;
    }

    const { password, ...rest } = checkUsr;

    res.status(200).json({
      message: "Success",
      result: rest,
      access_token: generateToken(checkUsr.id), // assuming it needs user id
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  chANGE THE ROLE OF THE USER

export const changeRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id, role } = req.body as {
      user_id: number;
      role: roles;
    };
    // @ts-ignore
    if(req.user.id === user_id) {
      res.status(400).json({
        message : "You can't update your Role"
      })
    }

    const checkUsr = await prisma.users.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!checkUsr) {
      res.status(404).json({
        messae: "User NOT Found",
      });
      return;
    }

    const user = await prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        role: role,
      },
    });

    const { password, ...rest } = user;

    res.status(200).json({
      message: "successfully changed role",
      user: rest,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed To Update the role",
    });
    return;
  }
};

// get list of Users

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1; // default to page 1
    const limit = parseInt(req.query.limit as string) || 10; // default to 10 users per page
    const skip = (page - 1) * limit;

    const [total, users] = await Promise.all([
      prisma.users.count(),
      prisma.users.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    res.status(200).json({
      message: "success",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      result: users.map((user) => {
        const { password, ...rest } = user;
        return rest;
      }),
    });
  } catch (error) {
    console.error("List Users Error:", error);
    res.status(500).json({
      message: "Failed to list users",
    });
  }
};

export const me = async ( req : Request , res : Response) => {
  res.status(200).json({
    // @ts-ignore
    user : req.user
  })
}

// Update Users
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const { firstname, lastname, email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        firstname: firstname || user.firstname,
        lastname: lastname || user.lastname,
        email: email?.toLowerCase() || user.email,
        password: password ? await argon2.hash(password) : user.password,
      },
    });

    const { password: _, ...rest } = updatedUser;

    res.status(200).json({
      message: "User updated successfully",
      user: rest,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// DELTE USERS
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await prisma.users.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
