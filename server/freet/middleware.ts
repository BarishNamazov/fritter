import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import {FriendCollection} from '../friend/collection';
import FreetCollection from '../freet/collection';

const isFreetExistsQuery = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.freetId) {
    res.status(400).json({
      error: 'Missing freet id.'
    });
    return;
  }

  const freetId = req.query.freetId as string;
  const validFormat = Types.ObjectId.isValid(freetId);
  const freet = validFormat ? await FreetCollection.findOne(freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: `Freet with freet ID ${freetId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.freetId) {
    res.status(400).json({
      error: 'Missing freet id.'
    });
    return;
  }

  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.params.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: `Freet with freet ID ${req.params.freetId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Freet content must be at least one character long.'
    });
    return;
  }

  // Do not want the following check
  // if (content.length > 140) {
  //   res.status(413).json({
  //     error: 'Freet content must be no more than 140 characters.'
  //   });
  //   return;
  // }

  const {visibility} = req.body as {visibility: string};
  if (visibility !== 'public' && visibility !== 'friends' && visibility !== 'only me') {
    res.status(400).json({
      error: 'Freet visibility must be either public, friends, or only me.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets.'
    });
    return;
  }

  next();
};

const _canUserViewFreet = async (userId: string, freetId: string) => {
  const freet = await FreetCollection.findOne(freetId);
  if (!freet) {
    return false;
  }

  if (freet.visibility === 'public') {
    return true;
  }

  if (freet.authorId._id.toString() === userId) {
    return true;
  }

  if (!userId
    || (freet.visibility === 'only me' && userId !== freet.authorId._id.toString())
    || (freet.visibility === 'friends' && !(await FriendCollection.findOneFriend(userId, freet.authorId._id.toString())))) {
    return false;
  }

  return true;
};

const isFreetViewAllowed = async (req: Request, res: Response, next: NextFunction) => {
  const freetId = req.params.freetId || req.query.freetId;
  const freet = await FreetCollection.findOne(freetId as string);

  if (await _canUserViewFreet(req.session.userId as string, freet._id.toString())) {
    next();
    return;
  }

  res.status(403).json({
    error: 'Not allowed to view this freet.'
  });
};

export {
  isValidFreetContent,
  isFreetExists,
  isFreetExistsQuery,
  isValidFreetModifier,
  isFreetViewAllowed,
  _canUserViewFreet
};
