module Main (main) where

import Lib
import Options.Applicative

data CommandLineApplication = CommandLineApplication String

-- | Create new @Ingestion@.
data CreateIngestion = CreateIngestion {
  compound :: String,
  dosage :: String,
}

createIngestionCommand :: Parser CreateIngestion
createIngestionCommand = CreateIngestion
  <$> strOption (
    long "compound"
    <> short 'c'
    <> metavar "COMPOUND"
    <> help "Compund to be ingested."
  )
  <*> strOption (
    long "dosage"
    <> short 'd'
    <> metavar "DOSAGE"
    <> help "Amount of COMPOUND being ingested."
  )

main :: IO CreateIngestion
main = execParser $ info createIngestionCommand mempty
