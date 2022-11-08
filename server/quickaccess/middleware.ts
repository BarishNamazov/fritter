import type {Request, Response, NextFunction} from 'express';

const isValidEntries = (req: Request, res: Response, next: NextFunction) => {
  const nameSet = new Set<string>();
  for (const {name, url} of (req.body.entries as Array<{name: string; url: string}>)) {
    if (!name || !url) {
      res.status(400).json({
        error: 'Entry names and links must be non-empty',
      });
      return;
    }

    if (nameSet.has(name)) {
      res.status(400).json({
        error: `All entries must be named differently: "${name}" exists twice.`
      });
      return;
    }

    nameSet.add(name);
  }

  next();
};

export {
  isValidEntries
};
